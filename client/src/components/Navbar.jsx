import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Bell, HelpCircle, Search, CreditCard, Settings, BookOpen, MessageCircle, Gift, ExternalLink } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const notifRef = useRef(null);
    const helpRef = useRef(null);
    const userMenuRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setShowHelp(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/dashboard' },
        { name: 'Messages', path: '/messages' },
        { name: 'My lessons', path: '/lessons' },
        { name: 'Learn', path: '/learn' },
        { name: 'Settings', path: '/settings' },
    ];
    const balanceHours = ((user?.balance_minutes || 0) / 60).toFixed(1);

    // Sample notifications
    const notifications = [
        { id: 1, text: 'Your lesson with Mr. Smith is confirmed', time: '2 hours ago', unread: true },
        { id: 2, text: 'New tutor available in your area', time: '1 day ago', unread: false },
    ];

    return (
        <nav className="fixed w-full z-[250] transition-all duration-300 overflow-visible">
            {/* Top Bar */}
            <div className="glass-nav px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight group-hover:text-cyan-700 transition-colors">PreplyUS</span>
                        </Link>

                        <Link
                            to="/teachers"
                            className="hidden lg:flex items-center text-sm font-medium text-slate-600 hover:text-cyan-700 transition-colors"
                        >
                            <Search className="w-4 h-4 mr-1.5" />
                            Find tutors
                        </Link>
                    </div>

                    <div className="hidden sm:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => navigate('/subscribe')}
                                        className="text-xs font-semibold px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors text-slate-700 dark:text-slate-200"
                                    >
                                        Subscribe
                                    </button>
                                    <Link to="/dashboard" className="flex flex-col items-end hover:opacity-80 transition-opacity">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Balance</span>
                                        <span className="text-sm font-semibold text-slate-700">{balanceHours} hours</span>
                                    </Link>
                                    <button
                                        onClick={() => navigate('/referral')}
                                        className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-green-300 transition-colors flex items-center"
                                    >
                                        <Gift className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                                        Get $50 credit
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4 text-slate-500 border-l border-slate-100 pl-6">
                                    {/* Notifications Dropdown */}
                                    <div className="relative" ref={notifRef}>
                                        <button
                                            onClick={() => {
                                                setShowNotifications(!showNotifications);
                                                setShowHelp(false);
                                                setShowUserMenu(false);
                                            }}
                                            className="p-1 hover:text-cyan-700 transition-colors relative"
                                        >
                                            <Bell className="w-5 h-5" />
                                            <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                                        </button>

                                        {showNotifications && (
                                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-fade-in z-[320]">
                                                <div className="px-4 py-2 border-b border-slate-100">
                                                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                                                </div>
                                                {notifications.length > 0 ? (
                                                    <div className="max-h-64 overflow-y-auto">
                                                        {notifications.map((notif) => (
                                                            <div
                                                                key={notif.id}
                                                                className={`px-4 py-3 hover:bg-slate-50 cursor-pointer ${notif.unread ? 'bg-indigo-50/50' : ''}`}
                                                            >
                                                                <p className="text-sm text-slate-700">{notif.text}</p>
                                                                <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="px-4 py-6 text-center text-slate-400 text-sm">
                                                        No notifications
                                                    </div>
                                                )}
                                                <div className="px-4 py-2 border-t border-slate-100">
                                                    <Link
                                                        to="/notifications"
                                                        onClick={() => setShowNotifications(false)}
                                                        className="text-sm text-cyan-700 font-medium hover:text-cyan-800"
                                                    >
                                                        View all notifications
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Help Dropdown */}
                                    <div className="relative" ref={helpRef}>
                                        <button
                                            onClick={() => {
                                                setShowHelp(!showHelp);
                                                setShowNotifications(false);
                                                setShowUserMenu(false);
                                            }}
                                            className="p-1 hover:text-cyan-700 transition-colors"
                                        >
                                            <HelpCircle className="w-5 h-5" />
                                        </button>

                                        {showHelp && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-fade-in z-[320]">
                                                <Link
                                                    to="/help"
                                                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    onClick={() => setShowHelp(false)}
                                                >
                                                    <BookOpen className="w-4 h-4 mr-3 text-slate-400" />
                                                    Help Center
                                                </Link>
                                                <Link
                                                    to="/contact"
                                                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    onClick={() => setShowHelp(false)}
                                                >
                                                    <MessageCircle className="w-4 h-4 mr-3 text-slate-400" />
                                                    Contact Support
                                                </Link>
                                                <a
                                                    href="https://www.preply.com/en/p/faqs"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-3 text-slate-400" />
                                                    FAQ
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* User Menu Dropdown */}
                                    <div className="relative" ref={userMenuRef}>
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(!showUserMenu);
                                                setShowNotifications(false);
                                                setShowHelp(false);
                                            }}
                                            className="w-8 h-8 rounded-full bg-cyan-700 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-cyan-800 transition-colors"
                                        >
                                            {user.name?.[0].toUpperCase() || 'U'}
                                        </button>

                                        {showUserMenu && (
                                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-fade-in z-[320]">
                                                <div className="px-4 py-3 border-b border-slate-100">
                                                    <p className="font-semibold text-slate-900">{user.name}</p>
                                                    <p className="text-sm text-slate-500 break-all">{user.email}</p>
                                                </div>
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <User className="w-4 h-4 mr-3 text-slate-400" />
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <Settings className="w-4 h-4 mr-3 text-slate-400" />
                                                    Settings
                                                </Link>
                                                <Link
                                                    to="/dashboard"
                                                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <CreditCard className="w-4 h-4 mr-3 text-slate-400" />
                                                    Billing
                                                </Link>
                                                <div className="border-t border-slate-100 mt-1 pt-1">
                                                    <button
                                                        onClick={() => {
                                                            setShowUserMenu(false);
                                                            handleLogout();
                                                        }}
                                                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <LogOut className="w-4 h-4 mr-3" />
                                                        Sign out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn-primary px-5 py-2 rounded-lg text-sm">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-slate-500 hover:bg-slate-50">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Secondary Nav Bar */}
            {user && (
                <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 hidden sm:block">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-12">
                            <div className="flex space-x-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`h-12 flex items-center px-1 border-b-2 text-sm font-medium transition-all ${location.pathname === link.path
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                            <Link
                                to="/business"
                                className="text-xs font-semibold text-slate-400 hover:text-indigo-600 cursor-pointer uppercase tracking-wider transition-colors"
                            >
                                For business
                            </Link>
                            {user?.role === 'teacher' && (
                                <Link
                                    to="/tutor/studio"
                                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer uppercase tracking-wider transition-colors"
                                >
                                    Tutor studio
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden bg-white border-b border-slate-100 animate-fade-in">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/teachers"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                >
                                    Find Tutors
                                </Link>
                                <div className="border-t border-slate-100 mt-4 pt-4 pb-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Sign out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:bg-indigo-50"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
