import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, Clock3, Video, CheckCircle, AlertCircle, MapPin, BookOpen } from 'lucide-react';
import { MOCK_TUTORS } from '../data/marketplaceData';

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const toMockTeacherShape = (mockTutor) => {
    const availability = {};
    DAY_KEYS.forEach((day) => { availability[day] = []; });
    mockTutor.availabilitySlots.forEach((slot) => {
        const day = DAY_KEYS[slot.dayOfWeek];
        if (!availability[day]) availability[day] = [];
        availability[day].push(slot.startTime);
    });

    return {
        id: `demo-${mockTutor.id}`,
        name: mockTutor.name,
        avatar_url: mockTutor.avatarUrl || '',
        teacherProfile: {
            id: `demo-${mockTutor.id}`,
            headline: mockTutor.subjects.join(' • '),
            subjects: mockTutor.subjects.map((subject, index) => ({ subject: { id: index + 1, name: subject } })),
            bio: 'Experienced tutor focused on state-aligned lesson outcomes.',
            state_alignment: mockTutor.statesCovered.join(', '),
            years_experience: 5,
            hourly_rate: mockTutor.hourlyRate,
            hourly_rate_display: mockTutor.hourlyRate,
            hourly_rate_display_currency: 'USD',
            availability,
        },
    };
};

const TeacherProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingStatus, setBookingStatus] = useState('');

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const { data } = await api.get(`/teachers/${id}`);
                setTeacher(data);
            } catch (error) {
                const mockTutor = MOCK_TUTORS.find((tutor) => tutor.id === id);
                if (mockTutor) {
                    setTeacher(toMockTeacherShape(mockTutor));
                } else {
                    console.error('Failed to fetch teacher', error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTeacher();
    }, [id]);

    const bookingSubjectId = useMemo(() => {
        return teacher?.teacherProfile?.subjects?.[0]?.subject?.id || '';
    }, [teacher]);

    const hourlyRateDisplay = useMemo(() => {
        const profile = teacher?.teacherProfile;
        const amount = Number(profile?.hourly_rate_display ?? profile?.hourly_rate ?? 0);
        const currency = profile?.hourly_rate_display_currency || 'USD';
        return `${currency} ${amount.toFixed(2)}`;
    }, [teacher]);

    const availability = useMemo(() => {
        const raw = teacher?.teacherProfile?.availability;
        if (!raw) return {};
        if (typeof raw === 'object') return raw;
        try {
            return JSON.parse(raw);
        } catch (_) {
            return {};
        }
    }, [teacher]);

    const availableTimes = useMemo(() => {
        if (!selectedDate) return [];
        const date = new Date(`${selectedDate}T00:00:00`);
        const dayKey = DAY_KEYS[date.getDay()];
        return availability[dayKey] || [];
    }, [availability, selectedDate]);

    const nextAvailableDate = useMemo(() => {
        const hasAnyAvailability = Object.values(availability).some((slots) => Array.isArray(slots) && slots.length > 0);
        if (!hasAnyAvailability) return '';

        const start = new Date();
        start.setHours(0, 0, 0, 0);
        for (let offset = 0; offset < 45; offset += 1) {
            const candidate = new Date(start);
            candidate.setDate(start.getDate() + offset);
            const dayKey = DAY_KEYS[candidate.getDay()];
            if ((availability[dayKey] || []).length > 0) {
                return candidate.toISOString().split('T')[0];
            }
        }
        return '';
    }, [availability]);

    useEffect(() => {
        if (selectedTime && !availableTimes.includes(selectedTime)) {
            setSelectedTime('');
        }
    }, [availableTimes, selectedTime]);

    useEffect(() => {
        if (!selectedDate && nextAvailableDate) {
            setSelectedDate(nextAvailableDate);
        }
    }, [selectedDate, nextAvailableDate]);

    const handleBook = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!selectedDate || !selectedTime) {
            setBookingStatus('error');
            return;
        }

        const startTime = new Date(`${selectedDate}T${selectedTime}`);
        const queryParams = new URLSearchParams({
            teacherId: teacher.teacherProfile.id,
            subjectId: String(bookingSubjectId),
            time: startTime.toISOString(),
            rate: String(Number(teacher.teacherProfile.hourly_rate_display ?? teacher.teacherProfile.hourly_rate ?? 0)),
            currency: teacher.teacherProfile.hourly_rate_display_currency || 'USD',
            teacherName: teacher.name,
        }).toString();

        navigate(`/payment?${queryParams}`);
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-slate-500">Loading tutor profile...</div>;
    if (!teacher) return <div className="min-h-screen pt-32 text-center text-slate-500">Tutor not found.</div>;

    const profile = teacher.teacherProfile;
    const minBookingDate = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen pt-32 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 glass-card rounded-3xl p-7">
                    <div className="flex items-start gap-5">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 flex items-center justify-center text-3xl font-bold text-sky-700 overflow-hidden">
                            {teacher.avatar_url ? (
                                <img src={teacher.avatar_url} alt={teacher.name} className="h-full w-full object-cover" />
                            ) : (
                                teacher.name.charAt(0)
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{teacher.name}</h1>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.headline || profile.subjects.map((s) => s.subject.name).join(' • ')}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {profile.subjects.map((s) => (
                                    <span key={s.subject.id} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                                        <BookOpen className="w-3.5 h-3.5 mr-1" />
                                        {s.subject.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 space-y-5">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">About</h2>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{profile.bio || 'Experienced tutor focused on student outcomes and curriculum alignment.'}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                                <p className="font-medium text-slate-900 dark:text-white flex items-center"><MapPin className="w-4 h-4 mr-2 text-emerald-600" />State Alignment</p>
                                <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.state_alignment || 'Multi-state aligned'}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                                <p className="font-medium text-slate-900 dark:text-white flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-sky-600" />Experience</p>
                                <p className="mt-1 text-slate-600 dark:text-slate-300">{profile.years_experience ? `${profile.years_experience}+ years` : 'Professional tutor'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="glass-card rounded-3xl p-6 h-fit sticky top-28">
                    <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{hourlyRateDisplay}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Per 60-minute lesson</div>
                    </div>

                    <div className="mt-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    min={minBookingDate}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Time</label>
                            <div className="relative">
                                <Clock3 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <select
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    disabled={!selectedDate}
                                >
                                    <option value="">{selectedDate ? 'Choose a time' : 'Select date first'}</option>
                                    {availableTimes.map((time) => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedDate && availableTimes.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">No available slots on this date. Please choose another day.</p>
                            )}
                            {!selectedDate && nextAvailableDate && (
                                <p className="text-xs text-slate-500 mt-1">Next available date selected automatically: {new Date(nextAvailableDate).toLocaleDateString()}.</p>
                            )}
                            {!nextAvailableDate && (
                                <p className="text-xs text-amber-600 mt-1">This tutor has not published availability yet.</p>
                            )}
                        </div>

                        {bookingStatus === 'error' && (
                            <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1.5" />
                                Please choose a valid date and time.
                            </p>
                        )}

                        <button
                            onClick={handleBook}
                            className="w-full btn-primary rounded-xl py-3 inline-flex items-center justify-center"
                        >
                            <Video className="w-5 h-5 mr-2" />
                            Continue to Secure Booking
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TeacherProfilePage;
