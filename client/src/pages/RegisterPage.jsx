import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, UserRound, ArrowRight, Sparkles } from 'lucide-react';

const ACCOUNT_TYPES = [
    {
        id: 'student',
        title: 'Student Account',
        description: 'Book tutors, track hours, and learn by state syllabus.',
        icon: UserRound,
    },
    {
        id: 'teacher',
        title: 'Tutor Account',
        description: 'Create your tutor profile, set rates, and manage lessons.',
        icon: GraduationCap,
    },
];

const RegisterPage = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const roleLabel = useMemo(() => (selectedRole === 'teacher' ? 'Tutor' : 'Student'), [selectedRole]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const chooseRole = (role) => {
        setSelectedRole(role);
        setFormData((prev) => ({ ...prev, role }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await register(formData);
            if (formData.role === 'student') {
                navigate('/onboarding');
            } else {
                navigate('/tutor/studio');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-5xl mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    <section className="glass-card rounded-3xl p-8 md:p-10">
                        <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Join PreplyUS
                        </span>
                        <h1 className="mt-5 text-4xl font-display font-bold text-slate-900 dark:text-white">
                            Choose your account type
                        </h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-300">
                            Start as a student or tutor. You can personalize everything after signup.
                        </p>

                        <div className="mt-8 space-y-3">
                            {ACCOUNT_TYPES.map((type) => {
                                const Icon = type.icon;
                                const active = selectedRole === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => chooseRole(type.id)}
                                        className={`w-full text-left rounded-2xl border p-4 transition-all ${active
                                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-sky-300'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`rounded-xl p-2 ${active ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{type.title}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{type.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-sky-700 dark:text-sky-300 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </section>

                    <section className="glass-card rounded-3xl p-8 md:p-10">
                        {!selectedRole ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                                    <ArrowRight className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Select account type first</h2>
                                <p className="text-slate-600 dark:text-slate-300 mt-2">
                                    Choose Student or Tutor on the left to continue.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create your {roleLabel} account</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-6">
                                    Enter your details to get started.
                                </p>

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            placeholder="Your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {error && <p className="text-sm text-red-500">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full btn-primary rounded-xl py-2.5"
                                    >
                                        {submitting ? 'Creating account...' : `Continue as ${roleLabel}`}
                                    </button>
                                </form>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
