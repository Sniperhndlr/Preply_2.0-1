import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2, CheckCircle } from 'lucide-react';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'Your lesson with Mr. Smith is confirmed', time: '2 hours ago', unread: true, type: 'lesson' },
        { id: 2, text: 'New tutor available in your area', time: '1 day ago', unread: false, type: 'info' },
        { id: 3, text: 'Your subscription will renew in 3 days', time: '2 days ago', unread: true, type: 'billing' },
        { id: 4, text: 'You earned a new badge: First Lesson Completed!', time: '1 week ago', unread: false, type: 'achievement' },
        { id: 5, text: 'Your tutor rescheduled the lesson to Friday', time: '1 week ago', unread: false, type: 'lesson' },
    ]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, unread: false } : n
        ));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="min-h-screen pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Bell className="w-8 h-8 text-indigo-600 mr-3 dark:text-indigo-400" />
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="ml-3 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full dark:bg-indigo-900/50 dark:text-indigo-300">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                        {notifications.map((notif, idx) => (
                            <div
                                key={notif.id}
                                className={`flex items-start justify-between p-4 ${notif.unread ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-800'
                                    } ${idx !== notifications.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''} hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors`}
                            >
                                <div className="flex items-start flex-1">
                                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${notif.unread ? 'bg-indigo-500' : 'bg-transparent'
                                        }`} />
                                    <div className="flex-1">
                                        <p className={`text-sm ${notif.unread ? 'text-slate-900 font-medium dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                            {notif.text}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">{notif.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    {notif.unread && (
                                        <button
                                            onClick={() => markAsRead(notif.id)}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30"
                                            title="Mark as read"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notif.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:text-red-400 dark:hover:bg-red-900/30"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center dark:bg-slate-800 dark:border-slate-700">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4 dark:text-slate-600" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 dark:text-white">No notifications</h3>
                        <p className="text-slate-500 dark:text-slate-400">You're all caught up! Check back later for updates.</p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link to="/dashboard" className="text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
