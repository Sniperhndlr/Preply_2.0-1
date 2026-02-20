import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

const SubscribePage = () => {
    const { refreshUser } = useAuth();
    const [loadingPlan, setLoadingPlan] = useState('');
    const [message, setMessage] = useState('');

    const plans = [
        {
            key: 'basic',
            name: 'Basic',
            price: 29,
            hours: 2,
            features: ['2 hours of tutoring', 'Access to all tutors', 'Message support'],
            popular: false,
        },
        {
            key: 'pro',
            name: 'Pro',
            price: 79,
            hours: 6,
            features: ['6 hours of tutoring', 'Priority booking', 'Video recordings', '24/7 support'],
            popular: true,
        },
        {
            key: 'premium',
            name: 'Premium',
            price: 149,
            hours: 12,
            features: ['12 hours of tutoring', 'Dedicated tutor', 'Progress tracking', 'Parent dashboard', 'Priority support'],
            popular: false,
        },
    ];

    const handleSubscribe = async (planKey) => {
        setLoadingPlan(planKey);
        setMessage('');

        try {
            const { data } = await api.post('/account/subscribe', { plan: planKey });
            await refreshUser();
            setMessage(`Subscription updated. ${Math.round((data.grantedMinutes || 0) / 60)} hours added to your balance.`);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to activate subscription.');
        } finally {
            setLoadingPlan('');
        }
    };

    return (
        <div className="min-h-screen pt-36 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Plan</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Subscribe to add tutoring hours directly to your account balance.
                    </p>
                    {message && <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{message}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`glass-card rounded-2xl p-8 border-2 transition-all hover:shadow-lg ${plan.popular ? 'border-sky-500 ring-2 ring-sky-100 dark:ring-sky-900/30' : 'border-slate-100 dark:border-slate-700'}`}
                        >
                            {plan.popular && (
                                <div className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                                <span className="text-slate-500 dark:text-slate-400 ml-2">/month</span>
                            </div>
                            <div className="text-sky-700 font-medium mb-6 flex items-center dark:text-sky-300">
                                <Zap className="w-4 h-4 mr-2" />
                                {plan.hours} hours of tutoring
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-slate-600 dark:text-slate-300">
                                        <Check className="w-4 h-4 text-green-500 mr-3" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSubscribe(plan.key)}
                                disabled={loadingPlan === plan.key}
                                className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.popular ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'}`}
                            >
                                {loadingPlan === plan.key ? 'Processing...' : 'Subscribe'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/dashboard" className="text-sky-700 font-medium hover:underline dark:text-sky-300">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SubscribePage;
