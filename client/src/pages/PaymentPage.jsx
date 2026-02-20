import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/config';
import { CreditCard, Lock, AlertCircle, Wallet, Clock3, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const teacherId = searchParams.get('teacherId');
    const subjectId = searchParams.get('subjectId');
    const time = searchParams.get('time');
    const rate = Number(searchParams.get('rate') || 0);
    const currency = searchParams.get('currency') || 'USD';
    const teacherName = searchParams.get('teacherName');

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [addMethodType, setAddMethodType] = useState('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState({ balance_minutes: 0, credits_usd: 0 });
    const [methods, setMethods] = useState([]);
    const [selectedMethodId, setSelectedMethodId] = useState('');

    const lessonMinutes = 60;

    const isValidLuhn = (value) => {
        const digits = String(value).replace(/\D/g, '');
        let sum = 0;
        let dbl = false;
        for (let i = digits.length - 1; i >= 0; i -= 1) {
            let n = parseInt(digits[i], 10);
            if (dbl) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            dbl = !dbl;
        }
        return digits.length >= 12 && digits.length <= 19 && sum % 10 === 0;
    };

    const parseExpiry = (value) => {
        const [m, y] = String(value || '').split('/');
        const mm = parseInt(m, 10);
        const yy = parseInt((y || '').length === 2 ? `20${y}` : y, 10);
        if (!mm || mm < 1 || mm > 12 || !yy) return null;
        return { mm, yy };
    };

    const isExpired = (mm, yy) => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        return yy < y || (yy === y && mm < m);
    };

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const { data } = await api.get('/account/billing-summary');
                setSummary({
                    balance_minutes: data.balance_minutes || 0,
                    credits_usd: data.credits_usd || 0,
                });
                setMethods(data.paymentMethods || []);
                const defaultMethod = (data.paymentMethods || []).find((method) => method.is_default);
                if (defaultMethod) setSelectedMethodId(String(defaultMethod.id));
            } catch (fetchError) {
                console.error(fetchError);
            }
        };
        fetchBilling();
    }, []);

    const balanceHours = useMemo(() => (summary.balance_minutes / 60).toFixed(1), [summary.balance_minutes]);

    const handleAddCard = async () => {
        setError('');
        if (addMethodType === 'paypal') {
            const email = String(paypalEmail || '').trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Enter a valid PayPal email.');
                return;
            }
            try {
                const { data } = await api.post('/account/payment-methods', {
                    methodType: 'paypal',
                    paypalEmail: email,
                    brand: 'PayPal',
                });
                const updatedMethods = [data, ...methods].sort((a, b) => Number(b.is_default) - Number(a.is_default));
                setMethods(updatedMethods);
                setSelectedMethodId(String(data.id));
                setPaypalEmail('');
                return;
            } catch (addError) {
                setError(addError.response?.data?.error || 'Failed to add PayPal');
                return;
            }
        }

        if (!cardNumber || !expiry) {
            setError('Enter card number and expiry before adding.');
            return;
        }
        if (!isValidLuhn(cardNumber)) {
            setError('Card number is invalid.');
            return;
        }
        const parsed = parseExpiry(expiry);
        if (!parsed) {
            setError('Expiry must be in MM/YY format.');
            return;
        }
        if (isExpired(parsed.mm, parsed.yy)) {
            setError('Card is expired.');
            return;
        }

        try {
            const { data } = await api.post('/account/payment-methods', {
                cardNumber,
                expiry,
                brand: 'Card',
                methodType: 'card',
            });
            const updatedMethods = [data, ...methods].sort((a, b) => Number(b.is_default) - Number(a.is_default));
            setMethods(updatedMethods);
            setSelectedMethodId(String(data.id));
            setCardNumber('');
            setExpiry('');
        } catch (addError) {
            setError(addError.response?.data?.error || 'Failed to add card');
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (String(teacherId).startsWith('demo-')) {
                await new Promise((resolve) => setTimeout(resolve, 600));
                await refreshUser();
                navigate('/dashboard');
                return;
            }

            const startTime = new Date(time);
            const endTime = new Date(startTime.getTime() + lessonMinutes * 60 * 1000);

            await api.post('/bookings', {
                teacherId: parseInt(teacherId, 10),
                subjectId: subjectId ? parseInt(subjectId, 10) : null,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: 'confirmed',
                paymentMethodId: selectedMethodId ? parseInt(selectedMethodId, 10) : null,
            });

            await refreshUser();
            navigate('/dashboard');
        } catch (err) {
            console.error('Payment failed', err);
            setError(err.response?.data?.error || 'Payment processing failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!teacherId || !time) {
        return <div className="text-center py-12">Invalid booking details. <button onClick={() => navigate('/teachers')} className="text-indigo-600 underline">Return to tutors</button></div>;
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Complete Booking</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">Secure checkout for your live lesson.</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-5">
                    <section className="lg:col-span-2 glass-card rounded-2xl p-5 h-fit">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Lesson Summary</h2>
                        <div className="space-y-3 text-sm">
                            <Row icon={<UserCircle2 className="w-4 h-4" />} label="Tutor" value={teacherName} />
                            <Row icon={<Clock3 className="w-4 h-4" />} label="Time" value={`${new Date(time).toLocaleDateString()} • ${new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
                            <Row icon={<Wallet className="w-4 h-4" />} label="Balance" value={`${balanceHours} hrs`} />
                            <Row icon={<Wallet className="w-4 h-4" />} label="Credits" value={`USD ${summary.credits_usd.toFixed(2)}`} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                            <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                            <span className="font-bold text-sky-700 dark:text-sky-300">{currency} {rate.toFixed(2)}</span>
                        </div>
                    </section>

                    <section className="lg:col-span-3 glass-card rounded-2xl p-6">
                        <div className="flex items-center mb-5">
                            <Lock className="w-4 h-4 text-emerald-600 mr-2" />
                            <h2 className="font-bold text-slate-900 dark:text-white">Payment Method</h2>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Use existing card</label>
                                <select
                                    value={selectedMethodId}
                                    onChange={(e) => setSelectedMethodId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                                >
                                    <option value="">Use balance/credits only</option>
                                    {methods.map((method) => (
                                        <option key={method.id} value={method.id}>
                                            {method.method_type === 'paypal'
                                                ? `PayPal (${method.paypal_email || 'account'})`
                                                : `${method.brand} ending in ${method.last4}`}{method.is_default ? ' (Default)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <button type="button" onClick={() => setAddMethodType('card')} className={`px-3 py-1.5 rounded-lg text-sm ${addMethodType === 'card' ? 'bg-cyan-700 text-white' : 'border border-slate-200 dark:border-slate-600'}`}>Card</button>
                                    <button type="button" onClick={() => setAddMethodType('paypal')} className={`px-3 py-1.5 rounded-lg text-sm ${addMethodType === 'paypal' ? 'bg-cyan-700 text-white' : 'border border-slate-200 dark:border-slate-600'}`}>PayPal</button>
                                </div>
                                {addMethodType === 'card' ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            className="col-span-2 w-full border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 dark:bg-slate-800"
                                            placeholder="Card number"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 dark:bg-slate-800"
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="email"
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-2.5 dark:bg-slate-800"
                                        placeholder="paypal@email.com"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                    />
                                )}
                                <button type="button" onClick={handleAddCard} className="mt-3 btn-secondary rounded-xl px-4 py-2 inline-flex items-center">
                                    <CreditCard className="w-4 h-4 mr-2" /> Add {addMethodType === 'card' ? 'Card' : 'PayPal'}
                                </button>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm flex items-center bg-red-50 p-2.5 rounded dark:bg-red-900/20 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full btn-primary py-3 rounded-xl ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Processing...' : `Confirm and Pay ${currency} ${rate.toFixed(2)}`}
                            </button>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                We apply balance hours first, then credits, then your selected payment method.
                            </p>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

const Row = ({ icon, label, value }) => (
    <div className="flex items-center justify-between gap-3">
        <span className="text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5">{icon}{label}</span>
        <span className="text-slate-900 dark:text-white font-medium text-right">{value}</span>
    </div>
);

export default PaymentPage;
