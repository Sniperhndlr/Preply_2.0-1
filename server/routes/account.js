const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const jwt = require('jsonwebtoken');
const { normalizeCurrency, supportedCurrencies } = require('../utils/currency');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const PLANS = {
    basic: { name: 'Basic', price: 29, hours: 2 },
    pro: { name: 'Pro', price: 79, hours: 6 },
    premium: { name: 'Premium', price: 149, hours: 12 },
};

const isValidLuhn = (cardNumber) => {
    const digits = String(cardNumber).replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i -= 1) {
        let digit = parseInt(digits.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return digits.length >= 12 && digits.length <= 19 && sum % 10 === 0;
};

const parseExpiry = (expiry) => {
    const [monthRaw, yearRaw] = String(expiry || '').split('/');
    const expMonth = parseInt(monthRaw, 10);
    const expYear = parseInt(yearRaw?.length === 2 ? `20${yearRaw}` : yearRaw, 10);
    if (!expMonth || expMonth < 1 || expMonth > 12 || !expYear) return null;
    return { expMonth, expYear };
};

const isExpired = (expMonth, expYear) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return expYear < year || (expYear === year && expMonth < month);
};

router.get('/billing-summary', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                balance_minutes: true,
                credits_usd: true,
                preferred_currency: true,
                subscription: true,
                paymentMethods: {
                    orderBy: [{ is_default: 'desc' }, { createdAt: 'desc' }],
                },
            },
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch billing summary' });
    }
});

router.get('/payment-methods', authenticateToken, async (req, res) => {
    try {
        const methods = await prisma.paymentMethod.findMany({
            where: { userId: req.user.id },
            orderBy: [{ is_default: 'desc' }, { createdAt: 'desc' }],
        });
        res.json(methods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
});

router.post('/payment-methods', authenticateToken, async (req, res) => {
    const { cardNumber, expiry, brand, methodType, paypalEmail } = req.body;
    const normalizedMethod = methodType === 'paypal' ? 'paypal' : 'card';

    try {
        const existingCount = await prisma.paymentMethod.count({ where: { userId: req.user.id } });
        let data;

        if (normalizedMethod === 'paypal') {
            const email = String(paypalEmail || '').trim().toLowerCase();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ error: 'Invalid PayPal email' });
            }
            data = {
                userId: req.user.id,
                method_type: 'paypal',
                brand: 'PayPal',
                last4: 'PPAL',
                exp_month: 1,
                exp_year: 2099,
                paypal_email: email,
                is_default: existingCount === 0,
            };
        } else {
            if (!cardNumber || !expiry) {
                return res.status(400).json({ error: 'Missing card details' });
            }
            if (!isValidLuhn(cardNumber)) {
                return res.status(400).json({ error: 'Invalid card number' });
            }
            const parsedExpiry = parseExpiry(expiry);
            if (!parsedExpiry) {
                return res.status(400).json({ error: 'Invalid expiry date' });
            }
            if (isExpired(parsedExpiry.expMonth, parsedExpiry.expYear)) {
                return res.status(400).json({ error: 'Card is expired' });
            }
            const digitsOnly = String(cardNumber).replace(/\D/g, '');
            data = {
                userId: req.user.id,
                method_type: 'card',
                brand: brand || 'Card',
                last4: digitsOnly.slice(-4),
                exp_month: parsedExpiry.expMonth,
                exp_year: parsedExpiry.expYear,
                is_default: existingCount === 0,
            };
        }

        const method = await prisma.paymentMethod.create({
            data,
        });

        res.json(method);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save payment method' });
    }
});

router.post('/payment-methods/:id/default', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const method = await prisma.paymentMethod.findUnique({ where: { id } });
        if (!method || method.userId !== req.user.id) {
            return res.status(404).json({ error: 'Payment method not found' });
        }

        await prisma.$transaction([
            prisma.paymentMethod.updateMany({
                where: { userId: req.user.id },
                data: { is_default: false },
            }),
            prisma.paymentMethod.update({
                where: { id },
                data: { is_default: true },
            }),
        ]);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update default payment method' });
    }
});

router.delete('/payment-methods/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const method = await prisma.paymentMethod.findUnique({ where: { id } });
        if (!method || method.userId !== req.user.id) {
            return res.status(404).json({ error: 'Payment method not found' });
        }

        await prisma.paymentMethod.delete({ where: { id } });

        if (method.is_default) {
            const nextMethod = await prisma.paymentMethod.findFirst({
                where: { userId: req.user.id },
                orderBy: { createdAt: 'desc' },
            });

            if (nextMethod) {
                await prisma.paymentMethod.update({
                    where: { id: nextMethod.id },
                    data: { is_default: true },
                });
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete payment method' });
    }
});

router.post('/subscribe', authenticateToken, async (req, res) => {
    const { plan } = req.body;
    const normalized = String(plan || '').toLowerCase();
    const selectedPlan = PLANS[normalized];

    if (!selectedPlan) return res.status(400).json({ error: 'Invalid plan selected' });

    try {
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await prisma.$transaction(async (tx) => {
            await tx.subscription.upsert({
                where: { userId: req.user.id },
                update: {
                    plan_name: selectedPlan.name,
                    status: 'active',
                    hours_per_month: selectedPlan.hours,
                    price_usd: selectedPlan.price,
                    current_period_end: periodEnd,
                },
                create: {
                    userId: req.user.id,
                    plan_name: selectedPlan.name,
                    status: 'active',
                    hours_per_month: selectedPlan.hours,
                    price_usd: selectedPlan.price,
                    current_period_end: periodEnd,
                },
            });

            await tx.user.update({
                where: { id: req.user.id },
                data: {
                    balance_minutes: {
                        increment: selectedPlan.hours * 60,
                    },
                },
            });
        });

        res.json({ success: true, grantedMinutes: selectedPlan.hours * 60 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to activate subscription' });
    }
});

router.post('/credits/redeem', authenticateToken, async (req, res) => {
    const { code } = req.body;

    if (String(code || '').trim().toUpperCase() !== 'FRIEND50') {
        return res.status(400).json({ error: 'Invalid referral code' });
    }

    try {
        const existing = await prisma.creditTransaction.findFirst({
            where: {
                userId: req.user.id,
                source: 'referral',
            },
        });

        if (existing) {
            return res.status(400).json({ error: 'Referral credit already claimed' });
        }

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: req.user.id },
                data: {
                    credits_usd: { increment: 50 },
                },
            });

            await tx.creditTransaction.create({
                data: {
                    userId: req.user.id,
                    amount_usd: 50,
                    source: 'referral',
                    description: 'Referral reward FRIEND50',
                },
            });
        });

        res.json({ success: true, amount: 50 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to redeem code' });
    }
});

router.get('/credits/transactions', authenticateToken, async (req, res) => {
    try {
        const transactions = await prisma.creditTransaction.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch credit transactions' });
    }
});

router.get('/settings', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { settings_json: true, preferred_currency: true },
        });

        const settings = user?.settings_json ? JSON.parse(user.settings_json) : null;
        res.json({ ...(settings || {}), preferredCurrency: user?.preferred_currency || 'USD' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

router.put('/settings', authenticateToken, async (req, res) => {
    try {
        const payload = req.body || {};
        const preferredCurrency = normalizeCurrency(payload.preferredCurrency);
        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                settings_json: JSON.stringify(payload),
                preferred_currency: preferredCurrency,
            },
            select: { settings_json: true, preferred_currency: true },
        });

        const parsed = updated.settings_json ? JSON.parse(updated.settings_json) : {};
        res.json({ ...parsed, preferredCurrency: updated.preferred_currency });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

router.get('/currencies', authenticateToken, async (req, res) => {
    res.json({ currencies: supportedCurrencies });
});

module.exports = router;
