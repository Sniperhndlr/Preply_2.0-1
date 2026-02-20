import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, FileText, Search } from 'lucide-react';

const HelpPage = () => {
    const categories = [
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: 'Getting Started',
            articles: ['How to book your first lesson', 'Setting up your profile', 'Choosing the right tutor']
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: 'Lessons & Scheduling',
            articles: ['How to reschedule a lesson', 'Cancellation policy', 'Joining a video lesson']
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: 'Billing & Payments',
            articles: ['Understanding your invoice', 'Payment methods', 'Refund requests']
        }
    ];

    return (
        <div className="min-h-screen pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Help Center</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Find answers to common questions and learn how to get the most out of PreplyHS.
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-12">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for help articles..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
                    />
                </div>

                {/* Categories */}
                <div className="space-y-8">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mr-4 dark:bg-indigo-900/50 dark:text-indigo-400">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cat.title}</h3>
                            </div>
                            <ul className="space-y-3">
                                {cat.articles.map((article, aIdx) => (
                                    <li key={aIdx}>
                                        <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:text-indigo-400">
                                            {article}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Still need help?</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">Our support team is here to assist you 24/7.</p>
                    <Link
                        to="/contact"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Contact Support
                    </Link>
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

export default HelpPage;
