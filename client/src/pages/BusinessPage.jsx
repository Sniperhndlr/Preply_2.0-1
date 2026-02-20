import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';

const BusinessPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Team Training',
            desc: 'Upskill your entire team with customized learning paths.'
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: 'Progress Analytics',
            desc: 'Track learning outcomes with detailed analytics dashboard.'
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Enterprise Security',
            desc: 'SOC 2 compliant with SSO and custom data retention.'
        }
    ];

    const handleRequestDemo = () => {
        navigate('/contact', { state: { subject: 'Request Demo for Business' } });
    };

    const handleContactSales = () => {
        navigate('/contact', { state: { subject: 'Business Sales Inquiry' } });
    };

    const handleGetStarted = () => {
        navigate('/register');
    };

    return (
        <div className="min-h-screen pt-36 pb-12 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Hero */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6 dark:bg-indigo-900/50 dark:text-indigo-300">
                        <Building2 className="w-4 h-4 mr-2" />
                        Enterprise Solutions
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        PreplyHS for Business
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
                        Empower your organization with world-class tutoring and training solutions tailored for enterprise needs.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleRequestDemo}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center"
                        >
                            Request Demo
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                        <button
                            onClick={handleContactSales}
                            className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 dark:bg-indigo-900/50 dark:text-indigo-400">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to transform your team's learning?</h2>
                    <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
                        Join thousands of companies already using PreplyHS to develop their workforce.
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                    >
                        Get Started Today
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BusinessPage;

