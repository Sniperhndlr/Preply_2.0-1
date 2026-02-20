import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Camera, Mail, Lock, Save, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: '',
        phone: ''
    });

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Profile</h1>

                {saved && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center text-green-700 dark:text-green-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Profile updated successfully!
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    {/* Avatar Section */}
                    <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="ml-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{user?.role === 'teacher' ? 'Tutor' : 'Student'}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSave} className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                    value={profile.email}
                                    disabled
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="+1 (555) 000-0000"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Tell us a bit about yourself..."
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/dashboard" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
