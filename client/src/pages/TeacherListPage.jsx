import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock3, Filter, Star } from 'lucide-react';
import StateFilterBar from '../components/StateFilterBar';
import { AVAILABILITY_PRESETS, COURSE_TYPES, GRADE_LEVELS, MOCK_TUTORS, SUBJECT_OPTIONS, TEST_PREP_TAGS, US_STATES } from '../data/marketplaceData';

const TeachersListPage = () => {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    subject: params.get('subject') || '',
    state: params.get('state') || '',
    gradeLevel: params.get('gradeLevel') || '',
    courseType: params.get('courseType') || '',
    standardsTag: params.get('standardsTag') || '',
    testPrepTag: params.get('testPrepTag') || '',
    minRate: Number(params.get('minRate') || 15),
    maxRate: Number(params.get('maxRate') || 80),
    availabilityPreset: params.get('availabilityPreset') || '',
    match: params.get('match') || '',
    tutorTypePreference: params.get('tutorTypePreference') || '',
  });

  useEffect(() => {
    setFilters({
      subject: params.get('subject') || '',
      state: params.get('state') || '',
      gradeLevel: params.get('gradeLevel') || '',
      courseType: params.get('courseType') || '',
      standardsTag: params.get('standardsTag') || '',
      testPrepTag: params.get('testPrepTag') || '',
      minRate: Number(params.get('minRate') || 15),
      maxRate: Number(params.get('maxRate') || 80),
      availabilityPreset: params.get('availabilityPreset') || '',
      match: params.get('match') || '',
      tutorTypePreference: params.get('tutorTypePreference') || '',
    });
  }, [params.toString()]);

  const filteredTutors = useMemo(() => {
    return MOCK_TUTORS.filter((tutor) => {
      if (filters.subject && !tutor.subjects.some((s) => s.toLowerCase().includes(filters.subject.toLowerCase()))) return false;
      if (filters.state && !tutor.statesCovered.includes(filters.state)) return false;
      if (filters.gradeLevel && !tutor.gradeLevels.includes(filters.gradeLevel)) return false;
      if (filters.courseType && !tutor.subjects.includes(filters.courseType)) return false;
      if (filters.standardsTag && !tutor.standardsTags.some((s) => s.toLowerCase().includes(filters.standardsTag.toLowerCase()))) return false;
      if (filters.testPrepTag && !tutor.standardsTags.some((s) => s.toLowerCase().includes(filters.testPrepTag.toLowerCase()))) return false;
      if (tutor.hourlyRate < filters.minRate || tutor.hourlyRate > filters.maxRate) return false;
      if (filters.availabilityPreset === 'After school' && !tutor.availabilitySlots.some((slot) => Number(slot.startTime.split(':')[0]) >= 16)) return false;
      if (filters.availabilityPreset === 'Weekends' && !tutor.availabilitySlots.some((slot) => slot.dayOfWeek === 0 || slot.dayOfWeek === 6)) return false;
      if (filters.tutorTypePreference && filters.tutorTypePreference !== 'Any' && tutor.tutorType !== filters.tutorTypePreference) return false;
      return true;
    }).map((tutor) => {
      const score = filters.match ? calculateMatchScore(tutor, filters) : null;
      return { ...tutor, matchScore: score };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [filters]);

  const chips = useMemo(() => {
    const entries = [];
    if (filters.state) entries.push({ id: 'state', label: `State: ${filters.state}` });
    if (filters.gradeLevel) entries.push({ id: 'gradeLevel', label: filters.gradeLevel });
    if (filters.subject) entries.push({ id: 'subject', label: filters.subject });
    if (filters.courseType) entries.push({ id: 'courseType', label: filters.courseType });
    if (filters.availabilityPreset) entries.push({ id: 'availabilityPreset', label: filters.availabilityPreset });
    return entries;
  }, [filters]);

  const syncUrl = (next) => {
    const urlParams = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) urlParams.set(key, String(value));
    });
    setParams(urlParams);
    setFilters(next);
  };

  const removeChip = (id) => syncUrl({ ...filters, [id]: '' });
  const clearAll = () => syncUrl({ ...filters, subject: '', state: '', gradeLevel: '', courseType: '', standardsTag: '', testPrepTag: '', availabilityPreset: '', match: '', tutorTypePreference: '' });

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-slate-900">Find tutors by state standards</h1>
          <p className="text-sm text-slate-600 mt-1">Filter by subject, grade, standards, budget, and schedule.</p>
        </div>

        <div className="glass-card rounded-2xl p-4 md:p-5 mb-4">
          <div className="grid md:grid-cols-4 gap-3">
            <input value={filters.subject} onChange={(e) => syncUrl({ ...filters, subject: e.target.value })} list="subjects" className="h-11 rounded-lg border border-slate-200 px-3" placeholder="Subject" />
            <datalist id="subjects">{SUBJECT_OPTIONS.map((s) => <option key={s} value={s} />)}</datalist>
            <select value={filters.state} onChange={(e) => syncUrl({ ...filters, state: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3"><option value="">All states</option>{US_STATES.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}</select>
            <select value={filters.gradeLevel} onChange={(e) => syncUrl({ ...filters, gradeLevel: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3"><option value="">All grades</option>{GRADE_LEVELS.map((g) => <option key={g} value={g}>{g}</option>)}</select>
            <select value={filters.courseType} onChange={(e) => syncUrl({ ...filters, courseType: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3"><option value="">Course type</option>{COURSE_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}</select>
          </div>

          <div className="grid md:grid-cols-4 gap-3 mt-3">
            <input value={filters.standardsTag} onChange={(e) => syncUrl({ ...filters, standardsTag: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3" placeholder="Standards tag" />
            <select value={filters.testPrepTag} onChange={(e) => syncUrl({ ...filters, testPrepTag: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3"><option value="">Test prep tag</option>{TEST_PREP_TAGS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}</select>
            <select value={filters.availabilityPreset} onChange={(e) => syncUrl({ ...filters, availabilityPreset: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3"><option value="">Availability</option>{AVAILABILITY_PRESETS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}</select>
            <select value={filters.tutorTypePreference} onChange={(e) => syncUrl({ ...filters, tutorTypePreference: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3">
              <option value="">Tutor type</option>
              <option value="Any">No preference</option>
              <option value="CertifiedTeacher">Certified teacher</option>
              <option value="CollegeStudent">College student</option>
              <option value="ProfessionalTutor">Professional tutor</option>
            </select>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-700 mb-2">Price range (${filters.minRate} - ${filters.maxRate}/hr)</p>
            <div className="grid md:grid-cols-2 gap-3">
              <input type="range" min={10} max={150} step={1} value={filters.minRate} onChange={(e) => syncUrl({ ...filters, minRate: Number(e.target.value) })} />
              <input type="range" min={10} max={150} step={1} value={filters.maxRate} onChange={(e) => syncUrl({ ...filters, maxRate: Number(e.target.value) })} />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Filter className="h-4 w-4 text-cyan-700" />
            <StateFilterBar chips={chips} onRemove={removeChip} onClearAll={clearAll} />
          </div>
        </div>

        <div className="space-y-4">
          {filteredTutors.map((tutor) => (
            <article key={tutor.id} className="glass-card rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-xl bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center">{tutor.name[0]}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{tutor.name}</h3>
                    <p className="text-sm text-slate-600">{tutor.statesCovered.join(', ')} • {tutor.gradeLevels.join(' / ')}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">{tutor.subjects.map((s) => <span key={s} className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-700">{s}</span>)}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">{tutor.standardsTags.map((s) => <span key={s} className="text-[10px] px-2 py-1 rounded-full border border-slate-200 text-slate-600">{s}</span>)}</div>
                  </div>
                </div>
                <div className="md:text-right">
                  {tutor.matchScore && <p className="text-xs text-emerald-700 font-semibold mb-1">Recommended for you • {tutor.matchScore}% match</p>}
                  <p className="text-xl font-bold text-slate-900">${tutor.hourlyRate}/hr</p>
                  <p className="text-xs text-slate-600 inline-flex items-center"><Star className="h-3.5 w-3.5 text-amber-400 mr-1" />{tutor.rating} ({tutor.ratingCount})</p>
                  <p className="text-xs text-slate-500 mt-1 inline-flex items-center"><Clock3 className="h-3.5 w-3.5 mr-1" />{describeAvailability(tutor)}</p>
                  <Link to={`/teachers/${tutor.id}`} className="mt-3 inline-block btn-primary px-4 py-2 rounded-lg text-sm">View profile</Link>
                </div>
              </div>
            </article>
          ))}
          {filteredTutors.length === 0 && <p className="text-sm text-slate-500">No tutors matched these filters.</p>}
        </div>
      </section>
    </main>
  );
};

const calculateMatchScore = (tutor, filters) => {
  let score = 70;
  if (filters.state && tutor.statesCovered.includes(filters.state)) score += 10;
  if (filters.subject && tutor.subjects.some((s) => s.toLowerCase().includes(filters.subject.toLowerCase()))) score += 8;
  if (filters.gradeLevel && tutor.gradeLevels.includes(filters.gradeLevel)) score += 6;
  if (filters.tutorTypePreference && filters.tutorTypePreference !== 'Any' && filters.tutorTypePreference === tutor.tutorType) score += 6;
  return Math.min(99, score);
};

const describeAvailability = (tutor) => {
  const hasWeekend = tutor.availabilitySlots.some((s) => s.dayOfWeek === 0 || s.dayOfWeek === 6);
  return hasWeekend ? 'After school + weekends' : 'After school availability';
};

export default TeachersListPage;
