import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, MessageCircle, Phone, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
    const location = useLocation();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Pre-fill subject if coming from Business page
    useEffect(() => {
        if (location.state?.subject) {
            setFormData(prev => ({ ...prev, subject: location.state.subject }));
        }
    }, [location.state]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center dark:bg-slate-900 transition-colors duration-300">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/50">
                        <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8">We'll get back to you within 24 hours.</p>
                    <Link to="/dashboard" className="text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Contact Support</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Have a question or need help? We're here for you.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: <Mail className="w-6 h-6" />, title: 'Email', value: 'support@syllabussync.com' },
                        { icon: <MessageCircle className="w-6 h-6" />, title: 'Live Chat', value: 'Available 24/7' },
                        { icon: <Phone className="w-6 h-6" />, title: 'Phone', value: '1-800-PREPLY' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-4 dark:bg-indigo-900/50 dark:text-indigo-400">
                                {item.icon}
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send us a message</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                            <textarea
                                rows={5}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/dashboard" className="text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
