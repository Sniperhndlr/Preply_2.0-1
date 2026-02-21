import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Copy, Check, Share2, Mail, MessageCircle } from 'lucide-react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

const ReferralPage = () => {
    const { refreshUser } = useAuth();
    const [copied, setCopied] = useState(false);
    const [claimState, setClaimState] = useState('');
    const referralCode = 'FRIEND50';
    const referralLink = `https://syllabussync.com/signup?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClaim = async () => {
        setClaimState('');
        try {
            await api.post('/account/credits/redeem', { code: referralCode });
            await refreshUser();
            setClaimState('Referral credit applied. $50 added to your account credits.');
        } catch (error) {
            setClaimState(error.response?.data?.error || 'Could not redeem referral code.');
        }
    };

    return (
        <div className="min-h-screen pt-36 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                        <Gift className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Give $50, Get $50</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                        Share SyllabusSync with friends and you both get $50 in tutoring credits.
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-8 mb-8">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Your Referral Link</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-50 dark:bg-slate-700 rounded-xl px-4 py-3 font-mono text-sm text-slate-600 dark:text-slate-300 break-all border border-slate-100 dark:border-slate-600">
                            {referralLink}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`px-5 py-3 rounded-xl font-semibold flex items-center transition-all ${copied ? 'bg-green-500 text-white' : 'btn-primary'}`}
                        >
                            {copied ? <><Check className="w-4 h-4 mr-2" />Copied!</> : <><Copy className="w-4 h-4 mr-2" />Copy</>}
                        </button>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Referral code: <span className="font-semibold">{referralCode}</span></p>
                        <button onClick={handleClaim} className="px-4 py-2 rounded-xl border border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                            Claim $50 Credit
                        </button>
                    </div>
                    {claimState && <p className="text-sm mt-3 text-slate-600 dark:text-slate-300">{claimState}</p>}

                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Or share via:</p>
                        <div className="flex gap-3">
                            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"><Mail className="w-4 h-4 mr-2" />Email</button>
                            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"><MessageCircle className="w-4 h-4 mr-2" />SMS</button>
                            <button className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors dark:bg-slate-600 dark:hover:bg-slate-500"><Share2 className="w-4 h-4 mr-2" />Share</button>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-8">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-6">How it works</h3>
                    <div className="space-y-4">
                        {[
                            { step: 1, title: 'Share your link', desc: 'Send your unique referral link to friends and family.' },
                            { step: 2, title: 'Friend signs up', desc: 'They create an account and book their first lesson.' },
                            { step: 3, title: 'You both get $50', desc: 'Credits are added to both accounts automatically.' },
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/50 rounded-full flex items-center justify-center text-sky-600 dark:text-sky-300 font-bold text-sm flex-shrink-0">{item.step}</div>
                                <div>
                                    <h4 className="font-medium text-slate-900 dark:text-white">{item.title}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/dashboard" className="text-sky-700 font-medium hover:underline dark:text-sky-300">← Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );
};

export default ReferralPage;
