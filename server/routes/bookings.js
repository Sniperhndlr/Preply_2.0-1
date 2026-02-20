const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const jwt = require('jsonwebtoken');
const { fromUSD, normalizeCurrency } = require('../utils/currency');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const isCardExpired = (expMonth, expYear) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return expYear < year || (expYear === year && expMonth < month);
};
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Create Booking
router.post('/', authenticateToken, async (req, res) => {
    const { teacherId, subjectId, startTime, endTime, paymentMethodId } = req.body;

    try {
        const parsedTeacherId = parseInt(teacherId, 10);
        let parsedSubjectId = Number.isInteger(parseInt(subjectId, 10)) ? parseInt(subjectId, 10) : null;
        const bookingStart = new Date(startTime);
        const bookingEnd = new Date(endTime);
        const durationMinutes = Math.max(
            1,
            Math.round((bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60)),
        );

        const teacher = await prisma.teacherProfile.findUnique({
            where: { id: parsedTeacherId },
            select: {
                hourly_rate: true,
                subjects: {
                    select: { subjectId: true },
                    take: 1,
                },
            },
        });

        if (!teacher) return res.status(404).json({ error: 'Teacher profile not found' });

        const student = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { balance_minutes: true, credits_usd: true, preferred_currency: true },
        });

        if (!student) return res.status(404).json({ error: 'Student not found' });

        if (!parsedSubjectId) {
            if (teacher.subjects.length > 0) {
                parsedSubjectId = teacher.subjects[0].subjectId;
            } else {
                const fallbackSubject = await prisma.subject.upsert({
                    where: { name: 'General Tutoring' },
                    update: {},
                    create: {
                        name: 'General Tutoring',
                        category: 'General',
                        grade_level: '9',
                    },
                });
                parsedSubjectId = fallbackSubject.id;
            }
        }

        const chargeUSD = ((teacher.hourly_rate || 0) * durationMinutes) / 60;
        const viewerCurrency = normalizeCurrency(student.preferred_currency || 'USD');
        const chargeAmount = fromUSD(chargeUSD, viewerCurrency);
        const roomId = `${parsedTeacherId}-${req.user.id}-${Date.now()}`;

        await prisma.$transaction(async (tx) => {
            let remainingMinutes = student.balance_minutes;
            let remainingCredits = student.credits_usd;

            if (remainingMinutes >= durationMinutes) {
                remainingMinutes -= durationMinutes;
            } else {
                const uncoveredMinutes = durationMinutes - remainingMinutes;
                remainingMinutes = 0;
                const uncoveredCost = ((teacher.hourly_rate || 0) * uncoveredMinutes) / 60;

                if (remainingCredits >= uncoveredCost) {
                    remainingCredits -= uncoveredCost;
                    await tx.creditTransaction.create({
                        data: {
                            userId: req.user.id,
                            amount_usd: -uncoveredCost,
                            source: 'lesson-credit',
                            description: 'Lesson payment from account credits',
                        },
                    });
                } else {
                    const preferredPayment = paymentMethodId
                        ? await tx.paymentMethod.findUnique({ where: { id: parseInt(paymentMethodId, 10) } })
                        : await tx.paymentMethod.findFirst({
                            where: { userId: req.user.id, is_default: true },
                        });

                    if (!preferredPayment || preferredPayment.userId !== req.user.id) {
                        throw new Error('PAYMENT_METHOD_REQUIRED');
                    }
                    if (preferredPayment.method_type === 'card' && isCardExpired(preferredPayment.exp_month, preferredPayment.exp_year)) {
                        throw new Error('PAYMENT_METHOD_EXPIRED');
                    }
                }
            }

            await tx.user.update({
                where: { id: req.user.id },
                data: {
                    balance_minutes: remainingMinutes,
                    credits_usd: remainingCredits,
                },
            });

            await tx.booking.create({
                data: {
                    studentId: req.user.id,
                    teacherId: parsedTeacherId,
                    subjectId: parsedSubjectId,
                    startTime: bookingStart,
                    endTime: bookingEnd,
                    status: req.body.status || 'pending',
                    meeting_link: `/classroom/${roomId}`,
                    charge_usd: chargeUSD,
                    charge_currency: viewerCurrency,
                    charge_amount: chargeAmount,
                },
            });
        });

        const booking = await prisma.booking.findFirst({
            where: {
                studentId: req.user.id,
                teacherId: parsedTeacherId,
                subjectId: parsedSubjectId,
                startTime: bookingStart,
            },
            orderBy: { id: 'desc' },
        });

        res.json(booking);
    } catch (error) {
        console.error(error);
        if (error.message === 'PAYMENT_METHOD_REQUIRED') {
            return res.status(402).json({ error: 'Please add a payment method or more credits before booking.' });
        }
        if (error.message === 'PAYMENT_METHOD_EXPIRED') {
            return res.status(402).json({ error: 'Your selected card is expired. Please add a valid card or PayPal.' });
        }
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Get My Bookings
router.get('/', authenticateToken, async (req, res) => {
    const isTeacher = req.user.role === 'teacher';

    try {
        const whereClause = isTeacher
            ? { teacher: { userId: req.user.id } }
            : { studentId: req.user.id };

        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                student: { select: { name: true, email: true } },
                teacher: { select: { user: { select: { name: true } } } },
                subject: true
            },
            orderBy: { startTime: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Update Booking Status
router.put('/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed', 'cancelled', 'completed'

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) },
            include: { teacher: true }
        });

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // Only teacher related to booking or the student (for cancellation) can modify
        // Simplifying to allow teacher to change any status, student only cancel
        if (req.user.role === 'student' && booking.studentId !== req.user.id) {
            return res.sendStatus(403);
        }
        if (req.user.role === 'teacher' && booking.teacher.userId !== req.user.id) {
            return res.sendStatus(403);
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

module.exports = router;
