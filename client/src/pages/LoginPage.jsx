import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-5xl mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    <section className="glass-card rounded-3xl p-8 md:p-10">
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Welcome Back
                        </span>
                        <h1 className="mt-5 text-4xl font-display font-bold text-slate-900 dark:text-white">Log in to SyllabusSync</h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-300">
                            Continue your lessons, manage your balance, and connect with tutors.
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                                <p className="font-semibold text-slate-900 dark:text-white">US curriculum aligned</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Find tutors by subject and state syllabus.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                                <p className="font-semibold text-slate-900 dark:text-white">Track your learning</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Monitor hours, credits, bookings, and progress.</p>
                            </div>
                        </div>
                    </section>

                    <section className="glass-card rounded-3xl p-8 md:p-10">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-4">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm">Secure access</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-6">
                            Enter your account credentials below.
                        </p>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary rounded-xl py-2.5"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
                            New here?{' '}
                            <Link to="/register" className="font-semibold text-sky-700 dark:text-sky-300 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
