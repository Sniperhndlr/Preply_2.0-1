import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Video, Zap, ArrowRight, MoreHorizontal, CheckCircle, Plus } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const upcomingBookings = bookings.filter(b => b.status !== 'cancelled');
    const balanceHours = ((user?.balance_minutes || 0) / 60).toFixed(1);
    const credits = Number(user?.credits_usd || 0).toFixed(2);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 transition-colors min-h-screen pt-36 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto animate-fade-in">

                {/* Greeting Section */}
                <div className="mb-10">
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1 transition-colors">Hi {user?.name?.split(' ')[0]},</p>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
                            Your dedication is impressive. <br className="hidden md:block" />
                            Keep it up!
                        </h1>
                        {user?.role === 'teacher' ? (
                            <Link to="/tutor/studio" className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                <Plus className="w-5 h-5" />
                                <span>Open tutor studio</span>
                            </Link>
                        ) : (
                            <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                <Plus className="w-5 h-5" />
                                <span>Add extra lessons</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="glass-card rounded-2xl p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Balance Hours</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{balanceHours}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Credits</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">${credits}</p>
                    </div>
                </div>

                {/* Main Action Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 p-8 md:p-10 mb-12 shadow-[0_8px_30px_rgb(99,102,241,0.04)] dark:shadow-none flex flex-col md:flex-row items-center justify-between relative overflow-hidden group transition-colors">
                    <div className="relative z-10 md:w-3/5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 border-2 border-white dark:border-slate-700 shadow-md transition-colors">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`} alt="User" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
                            Get more lessons to boost your progress
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm transition-colors">
                            You've scheduled {upcomingBookings.length} lessons. To schedule more, add extra lessons or upgrade your plan.
                        </p>
                        <Link to="/teachers" className="inline-block px-8 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200 dark:shadow-none">
                            Upgrade plan
                        </Link>
                    </div>

                    <div className="md:w-2/5 flex justify-end mt-8 md:mt-0">
                        {/* Abstract arrows decoration to mimic the image */}
                        <div className="relative w-48 h-48 flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute transform -rotate-12 translate-x-4">
                                <ArrowRight className="w-24 h-24 text-indigo-400 rotate-[-90deg]" strokeWidth={3} />
                            </div>
                            <div className="absolute transform rotate-12 -translate-x-4 translate-y-4">
                                <ArrowRight className="w-20 h-20 text-blue-400 rotate-[-45deg]" strokeWidth={3} />
                            </div>
                            <div className="absolute transform translate-x-8 translate-y-8">
                                <ArrowRight className="w-16 h-16 text-teal-400 rotate-[-120deg]" strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 gap-10">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Up next</h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-slate-400 space-x-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        ) : upcomingBookings.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-12 text-center shadow-sm transition-colors">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-500 mx-auto mb-4 transition-colors">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 transition-colors">No lessons scheduled</h4>
                                <p className="text-slate-500 dark:text-slate-400 transition-colors">Pick a tutor and start learning today!</p>
                                <Link to="/teachers" className="mt-6 inline-block text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                                    Browse tutors →
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col md:flex-row items-center justify-between group hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-md transition-all">
                                        <div className="flex items-center space-x-6 w-full md:w-auto">
                                            <div className="flex-shrink-0 w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-600 transition-colors">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                                                    {new Date(booking.startTime).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                                    {new Date(booking.startTime).getDate()}
                                                </span>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {new Date(booking.startTime).toLocaleDateString('en-US', { weekday: 'long' })} · {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1 transition-colors">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                    With {user?.role === 'teacher' ? booking.student.name : booking.teacher.user.name}
                                                    <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
                                                    {booking.subject.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 mt-4 md:mt-0 w-full md:w-auto justify-end">
                                            {booking.status === 'confirmed' ? (
                                                <a href={booking.meeting_link ? `${booking.meeting_link}?role=${user?.role === 'teacher' ? 'host' : 'guest'}` : '#'} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center shadow-md shadow-indigo-100 dark:shadow-none">
                                                    <Video className="w-4 h-4 mr-2" />
                                                    Enter classroom
                                                </a>
                                            ) : (
                                                <span className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-100 dark:border-amber-800 uppercase tracking-wider transition-colors">
                                                    {booking.status}
                                                </span>
                                            )}
                                            <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
