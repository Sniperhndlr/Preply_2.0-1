import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { GRADE_LEVELS, SUBJECT_OPTIONS, US_STATES } from '../data/marketplaceData';

const DEFAULT_STATE = {
  subject: '', gradeLevel: '', state: '', budgetMin: 15, budgetMax: 40,
  tutorTypePreference: 'Any', availability: 'After school',
};

const MatchWizard = ({ open, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(DEFAULT_STATE);

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(data.subject && data.gradeLevel && data.state);
    if (step === 2) return Boolean(data.availability);
    if (step === 3) return data.budgetMin <= data.budgetMax;
    return true;
  }, [step, data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[400] bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl border border-slate-200 shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Get matched for me</h2>
          <button onClick={onClose}><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-5">
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-5"><div className="h-full bg-cyan-600" style={{ width: `${(step / 4) * 100}%` }} /></div>

          {step === 1 && (
            <div className="grid md:grid-cols-3 gap-3">
              <select value={data.subject} onChange={(e) => setData({ ...data, subject: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3">
                <option value="">Subject</option>{SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={data.gradeLevel} onChange={(e) => setData({ ...data, gradeLevel: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3">
                <option value="">Grade</option>{GRADE_LEVELS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={data.state} onChange={(e) => setData({ ...data, state: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3">
                <option value="">State</option>{US_STATES.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              {['Weekdays after 4pm', 'Weekends', 'Flexible'].map((opt) => (
                <button type="button" key={opt} onClick={() => setData({ ...data, availability: opt })} className={`w-full text-left p-3 rounded-lg border ${data.availability === opt ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}>{opt}</button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={data.budgetMin} onChange={(e) => setData({ ...data, budgetMin: Number(e.target.value) })} className="h-11 rounded-lg border border-slate-200 px-3" placeholder="Min/hr" />
              <input type="number" value={data.budgetMax} onChange={(e) => setData({ ...data, budgetMax: Number(e.target.value) })} className="h-11 rounded-lg border border-slate-200 px-3" placeholder="Max/hr" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              {['Any', 'CertifiedTeacher', 'CollegeStudent', 'ProfessionalTutor'].map((type) => (
                <button type="button" key={type} onClick={() => setData({ ...data, tutorTypePreference: type })} className={`w-full text-left p-3 rounded-lg border ${data.tutorTypePreference === type ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}>{type}</button>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between">
          <button disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="btn-secondary px-4 py-2 rounded-lg disabled:opacity-50">Back</button>
          {step < 4 ? (
            <button disabled={!canNext} onClick={() => setStep((s) => Math.min(4, s + 1))} className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50">Next</button>
          ) : (
            <button onClick={() => onSubmit(data)} className="btn-primary px-4 py-2 rounded-lg">Show matches</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchWizard;
