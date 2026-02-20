import React from 'react';
import { Search, LocateFixed } from 'lucide-react';
import { GRADE_LEVELS, SUBJECT_OPTIONS, US_STATES } from '../../data/marketplaceData';

const HeroSearch = ({ values, onChange, onSearch, onAutoMatch, onUseLocation, onStateChip }) => {
  const popular = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA'];

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6">
      <div className="grid md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input
            value={values.subject}
            onChange={(e) => onChange({ ...values, subject: e.target.value })}
            list="subject-options"
            className="w-full h-12 rounded-xl border border-slate-200 px-4"
            placeholder="Math, Algebra 1, Biology..."
          />
          <datalist id="subject-options">
            {SUBJECT_OPTIONS.map((subject) => <option key={subject} value={subject} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Grade level</label>
          <select value={values.gradeLevel} onChange={(e) => onChange({ ...values, gradeLevel: e.target.value })} className="w-full h-12 rounded-xl border border-slate-200 px-3">
            <option value="">All grades</option>
            {GRADE_LEVELS.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
          <select value={values.state} onChange={(e) => onChange({ ...values, state: e.target.value })} className="w-full h-12 rounded-xl border border-slate-200 px-3">
            <option value="">All states</option>
            {US_STATES.map((state) => <option key={state.code} value={state.code}>{state.code} - {state.name}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button onClick={onSearch} className="btn-primary px-5 h-11 rounded-xl inline-flex items-center"><Search className="h-4 w-4 mr-2" />Search tutors</button>
        <button onClick={onAutoMatch} className="btn-secondary px-5 h-11 rounded-xl">Get matched for me</button>
        <button onClick={onUseLocation} className="px-4 h-11 rounded-xl border border-slate-200 inline-flex items-center text-sm text-slate-700"><LocateFixed className="h-4 w-4 mr-2" />Use my location</button>
      </div>
      <p className="mt-3 text-sm text-slate-600">Choose your subject, grade, and state to see tutors who teach exactly what you&apos;re learning in school.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Popular states:</span>
        {popular.map((state) => (
          <button key={state} onClick={() => onStateChip(state)} className={`px-3 py-1 rounded-full text-xs border ${values.state === state ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white border-slate-200 text-slate-700'}`}>
            {state}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSearch;
