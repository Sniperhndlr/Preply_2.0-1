import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';
import { Save, GraduationCap, Clock3, DollarSign, BookOpen } from 'lucide-react';

const WEEK_DAYS = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
];

const SLOT_OPTIONS = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

const TutorStudioPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState({ totalLessons: 0, confirmedLessons: 0, upcomingLessons: 0 });
    const [subjectCatalog, setSubjectCatalog] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [availability, setAvailability] = useState({});
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        headline: '',
        bio: '',
        hourly_rate: '',
        hourly_rate_currency: 'USD',
        state_alignment: '',
        years_experience: '',
        education: '',
        certifications: '',
        timezone: '',
        video_url: '',
        intro_video_url: '',
        zoom_link: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: profileData }, { data: statsData }] = await Promise.all([
                    api.get('/tutor/profile'),
                    api.get('/tutor/stats'),
                ]);

                const profile = profileData.profile;
                setSubjectCatalog(profileData.subjectCatalog || []);
                setSelectedSubjects((profile.subjects || []).map((s) => s.subjectId));
                setStats(statsData);
                let parsedAvailability = {};
                if (profile.availability) {
                    try {
                        parsedAvailability = JSON.parse(profile.availability);
                    } catch (_) {
                        parsedAvailability = {};
                    }
                }
                setAvailability(parsedAvailability);

                setForm({
                    headline: profile.headline || '',
                    bio: profile.bio || '',
                    hourly_rate: profile.hourly_rate_local || profile.hourly_rate || '',
                    hourly_rate_currency: profile.hourly_rate_currency || 'USD',
                    state_alignment: profile.state_alignment || '',
                    years_experience: profile.years_experience || '',
                    education: profile.education || '',
                    certifications: profile.certifications || '',
                    timezone: profile.timezone || '',
                    video_url: profile.video_url || '',
                    intro_video_url: profile.intro_video_url || '',
                    zoom_link: profile.zoom_link || '',
                });
            } catch (error) {
                console.error('Failed to load tutor studio', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const profileCompletion = useMemo(() => {
        const required = [form.headline, form.bio, form.hourly_rate, form.state_alignment];
        const filled = required.filter((x) => String(x).trim()).length + (selectedSubjects.length > 0 ? 1 : 0);
        return Math.round((filled / 5) * 100);
    }, [form, selectedSubjects]);

    if (!user) return null;
    if (user.role !== 'teacher') return <Navigate to="/dashboard" replace />;

    const toggleSubject = (subjectId) => {
        setSelectedSubjects((prev) =>
            prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleSlot = (dayKey, slot) => {
        setAvailability((prev) => {
            const existing = new Set(prev[dayKey] || []);
            if (existing.has(slot)) existing.delete(slot);
            else existing.add(slot);
            return {
                ...prev,
                [dayKey]: Array.from(existing).sort(),
            };
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await api.put('/tutor/profile', {
                ...form,
                hourly_rate: Number(form.hourly_rate),
                years_experience: form.years_experience ? Number(form.years_experience) : null,
                subjectIds: selectedSubjects,
                availability,
            });
            setMessage('Tutor profile updated successfully.');
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.error || 'Failed to save tutor profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-32 text-center text-slate-500">Loading tutor studio...</div>;
    }

    return (
        <div className="min-h-screen pt-28 pb-14 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Tutor Studio</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">Manage your tutor account, subjects, rates, and profile details.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <StatCard icon={<GraduationCap className="w-5 h-5" />} label="Total Lessons" value={stats.totalLessons} />
                    <StatCard icon={<Clock3 className="w-5 h-5" />} label="Upcoming" value={stats.upcomingLessons} />
                    <StatCard icon={<DollarSign className="w-5 h-5" />} label="Confirmed" value={stats.confirmedLessons} />
                </div>

                <div className="glass-card rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Profile completion</span>
                        <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">{profileCompletion}%</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" style={{ width: `${profileCompletion}%` }} />
                    </div>
                </div>

                <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input name="headline" value={form.headline} onChange={handleChange} label="Headline" placeholder="US Math Tutor | AP, SAT, State Exams" />
                        <Input name="hourly_rate" value={form.hourly_rate} onChange={handleChange} label={`Hourly Rate (${form.hourly_rate_currency})`} placeholder="45" type="number" min="1" />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Charge Currency</label>
                            <select
                                name="hourly_rate_currency"
                                value={form.hourly_rate_currency}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white"
                            >
                                {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED', 'JPY'].map((currency) => (
                                    <option key={currency} value={currency}>{currency}</option>
                                ))}
                            </select>
                        </div>
                        <Input name="state_alignment" value={form.state_alignment} onChange={handleChange} label="State Alignment" placeholder="CA, TX, NY" />
                        <Input name="years_experience" value={form.years_experience} onChange={handleChange} label="Years of Experience" placeholder="8" type="number" min="0" />
                        <Input name="timezone" value={form.timezone} onChange={handleChange} label="Timezone" placeholder="America/New_York" />
                        <Input name="zoom_link" value={form.zoom_link} onChange={handleChange} label="Classroom Link" placeholder="https://..." />
                        <Input name="video_url" value={form.video_url} onChange={handleChange} label="Video URL" placeholder="https://..." />
                        <Input name="intro_video_url" value={form.intro_video_url} onChange={handleChange} label="Intro Video URL" placeholder="https://..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                        <textarea
                            name="bio"
                            rows={4}
                            value={form.bio}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
                            placeholder="Describe your teaching approach and student outcomes..."
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Education</label>
                            <textarea
                                name="education"
                                rows={3}
                                value={form.education}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
                                placeholder="Degrees and institutions"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Certifications</label>
                            <textarea
                                name="certifications"
                                rows={3}
                                value={form.certifications}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white"
                                placeholder="State certifications, AP training, etc."
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-slate-500" />
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subjects You Teach</label>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {subjectCatalog.map((subject) => (
                                <label key={subject.id} className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={selectedSubjects.includes(subject.id)}
                                        onChange={() => toggleSubject(subject.id)}
                                    />
                                    <span>{subject.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Clock3 className="w-4 h-4 text-slate-500" />
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Weekly Availability (60-min slots)</label>
                        </div>
                        <div className="space-y-3">
                            {WEEK_DAYS.map((day) => (
                                <div key={day.key} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">{day.label}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {SLOT_OPTIONS.map((slot) => {
                                            const active = (availability[day.key] || []).includes(slot);
                                            return (
                                                <button
                                                    key={`${day.key}-${slot}`}
                                                    type="button"
                                                    onClick={() => toggleSlot(day.key, slot)}
                                                    className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${active
                                                        ? 'bg-sky-600 text-white border-sky-600'
                                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-sky-300'}`}
                                                >
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}

                    <div className="flex items-center justify-between">
                        <Link to="/dashboard" className="text-sky-700 dark:text-sky-300 hover:underline">Back to dashboard</Link>
                        <button type="submit" disabled={saving} className="btn-primary rounded-xl px-5 py-2.5 inline-flex items-center">
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Tutor Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
        <input
            {...props}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white"
        />
    </div>
);

const StatCard = ({ icon, label, value }) => (
    <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300 text-sm">{icon}<span>{label}</span></div>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
);

export default TutorStudioPage;
