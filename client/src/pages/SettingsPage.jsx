import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Globe, Moon, Shield, Save, CheckCircle, CreditCard, Trash2, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/config';

const SettingsPage = () => {
    const { darkMode, setDarkMode } = useTheme();
    const { refreshUser } = useAuth();
    const [saved, setSaved] = useState(false);
    const [billingError, setBillingError] = useState('');
    const [cardForm, setCardForm] = useState({ cardNumber: '', expiry: '' });
    const [paypalEmail, setPaypalEmail] = useState('');
    const [addMethodType, setAddMethodType] = useState('card');
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        lessonReminders: true,
        marketingEmails: false,
        language: 'en',
        preferredCurrency: 'USD',
    });

    const fetchSettings = async () => {
        try {
            const [{ data: storedSettings }, { data: methods }] = await Promise.all([
                api.get('/account/settings'),
                api.get('/account/payment-methods'),
            ]);

            setPaymentMethods(methods || []);
            if (storedSettings && Object.keys(storedSettings).length > 0) {
                setSettings((prev) => ({ ...prev, ...storedSettings }));
                if (typeof storedSettings.darkMode === 'boolean') {
                    setDarkMode(storedSettings.darkMode);
                }
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            await api.put('/account/settings', {
                ...settings,
                darkMode,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
            await refreshUser();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddCard = async () => {
        setBillingError('');
        if (addMethodType === 'paypal') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(paypalEmail || '').trim())) {
                setBillingError('Please enter a valid PayPal email.');
                return;
            }
        } else {
            const digits = String(cardForm.cardNumber || '').replace(/\D/g, '');
            if (digits.length < 12 || !cardForm.expiry) {
                setBillingError('Please enter valid card details.');
                return;
            }
        }
        try {
            await api.post('/account/payment-methods', {
                cardNumber: cardForm.cardNumber,
                expiry: cardForm.expiry,
                brand: 'Card',
                methodType: addMethodType,
                paypalEmail,
            });
            setCardForm({ cardNumber: '', expiry: '' });
            setPaypalEmail('');
            await fetchSettings();
        } catch (error) {
            setBillingError(error.response?.data?.error || 'Failed to add payment method');
        }
    };

    const handleDeleteCard = async (id) => {
        try {
            await api.delete(`/account/payment-methods/${id}`);
            await fetchSettings();
        } catch (error) {
            setBillingError(error.response?.data?.error || 'Failed to remove payment method');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.post(`/account/payment-methods/${id}/default`);
            await fetchSettings();
        } catch (error) {
            setBillingError(error.response?.data?.error || 'Failed to update default payment method');
        }
    };

    const Toggle = ({ enabled, onChange }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-600'}`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>

                {saved && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center text-green-700 dark:text-green-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Settings saved successfully.
                    </div>
                )}

                <div className="space-y-6">
                    <Card icon={<Bell className="w-5 h-5 text-sky-600 mr-3" />} title="Notifications">
                        <SettingRow title="Email Notifications" desc="Receive updates and alerts via email">
                            <Toggle enabled={settings.emailNotifications} onChange={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })} />
                        </SettingRow>
                        <SettingRow title="SMS Notifications" desc="Get text message reminders">
                            <Toggle enabled={settings.smsNotifications} onChange={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })} />
                        </SettingRow>
                        <SettingRow title="Lesson Reminders" desc="Reminder 1 hour before lessons">
                            <Toggle enabled={settings.lessonReminders} onChange={() => setSettings({ ...settings, lessonReminders: !settings.lessonReminders })} />
                        </SettingRow>
                    </Card>

                    <Card icon={<Moon className="w-5 h-5 text-sky-600 mr-3" />} title="Appearance">
                        <SettingRow title="Dark Mode" desc="Use dark theme across the app">
                            <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                        </SettingRow>
                    </Card>

                    <Card icon={<Globe className="w-5 h-5 text-sky-600 mr-3" />} title="Language & Region">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </select>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 mb-2">Preferred Currency</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            value={settings.preferredCurrency}
                            onChange={(e) => setSettings({ ...settings, preferredCurrency: e.target.value })}
                        >
                            {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED', 'JPY'].map((currency) => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </Card>

                    <Card icon={<CreditCard className="w-5 h-5 text-sky-600 mr-3" />} title="Payment Methods">
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setAddMethodType('card')} className={`px-3 py-1.5 rounded-lg text-sm ${addMethodType === 'card' ? 'bg-cyan-700 text-white' : 'border border-slate-200 dark:border-slate-600'}`}>Card</button>
                            <button type="button" onClick={() => setAddMethodType('paypal')} className={`px-3 py-1.5 rounded-lg text-sm ${addMethodType === 'paypal' ? 'bg-cyan-700 text-white' : 'border border-slate-200 dark:border-slate-600'}`}>PayPal</button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3 mb-4">
                            {addMethodType === 'card' ? (
                                <>
                                    <input
                                        value={cardForm.cardNumber}
                                        onChange={(e) => setCardForm((prev) => ({ ...prev, cardNumber: e.target.value }))}
                                        placeholder="Card number"
                                        className="md:col-span-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                                    />
                                    <input
                                        value={cardForm.expiry}
                                        onChange={(e) => setCardForm((prev) => ({ ...prev, expiry: e.target.value }))}
                                        placeholder="MM/YY"
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                                    />
                                </>
                            ) : (
                                <input
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                    placeholder="paypal@email.com"
                                    className="md:col-span-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                                />
                            )}
                        </div>
                        <button onClick={handleAddCard} className="btn-primary rounded-xl px-4 py-2">Add {addMethodType === 'card' ? 'Card' : 'PayPal'}</button>
                        {billingError && <p className="text-sm text-red-500 mt-2">{billingError}</p>}

                        <div className="mt-5 space-y-2">
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {method.method_type === 'paypal' ? `PayPal (${method.paypal_email || 'account'})` : `${method.brand} ending in ${method.last4}`}
                                        </p>
                                        {method.method_type === 'card' && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Exp {String(method.exp_month).padStart(2, '0')}/{String(method.exp_year).slice(-2)}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!method.is_default && (
                                            <button onClick={() => handleSetDefault(method.id)} className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">Set default</button>
                                        )}
                                        {method.is_default && <span className="text-xs text-emerald-700 dark:text-emerald-400 inline-flex items-center"><Star className="w-3 h-3 mr-1" />Default</span>}
                                        <button onClick={() => handleDeleteCard(method.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card icon={<Shield className="w-5 h-5 text-sky-600 mr-3" />} title="Security">
                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Change Password
                        </button>
                    </Card>
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={handleSave} className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center">
                        <Save className="w-5 h-5 mr-2" />
                        Save All Settings
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/dashboard" className="text-sky-700 dark:text-sky-300 font-medium hover:underline">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Card = ({ icon, title, children }) => (
    <div className="glass-card rounded-2xl border p-6">
        <div className="flex items-center mb-6">
            {icon}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const SettingRow = ({ title, desc, children }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <p className="font-medium text-slate-900 dark:text-white">{title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
        {children}
    </div>
);

export default SettingsPage;
