import React, { useMemo, useState } from 'react';
import { GRADE_LEVELS, SUBJECT_OPTIONS, US_STATES } from '../data/marketplaceData';

const schoolTypes = ['Public', 'Private', 'Homeschool', 'Other'];
const goals = ['Catch up', 'Stay on track', 'Get ahead', 'Test prep', 'AP'];
const preferences = ['Visual explanations', 'Step-by-step practice', 'Homework help', 'Exam drills', 'Interactive problem solving'];

const OnboardingWizard = ({ initial = {}, onSavePartial = () => {}, onComplete = () => {} }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    state: '', gradeLevel: '', schoolType: 'Public', goals: [], subjects: [], sessionsPerWeek: 1, learningPreferences: [], ...initial,
  });

  const progress = useMemo(() => (step / 4) * 100, [step]);

  const toggleMulti = (field, value) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      const next = exists ? prev[field].filter((v) => v !== value) : [...prev[field], value];
      const payload = { ...prev, [field]: next };
      onSavePartial(payload);
      return payload;
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 max-w-3xl mx-auto">
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-6"><div className="h-full bg-cyan-600" style={{ width: `${progress}%` }} /></div>

      {step === 1 && (
        <div className="grid md:grid-cols-3 gap-3">
          <label className="text-sm">
            <span className="block mb-1 text-slate-700">State</span>
          <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3">
            <option value="">State</option>{US_STATES.map((s) => <option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}
          </select>
          </label>
          <label className="text-sm">
            <span className="block mb-1 text-slate-700">Grade level</span>
          <select value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3">
            <option value="">Grade level</option>{GRADE_LEVELS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          </label>
          <label className="text-sm">
            <span className="block mb-1 text-slate-700">School type</span>
          <select value={form.schoolType} onChange={(e) => setForm({ ...form, schoolType: e.target.value })} className="h-11 rounded-lg border border-slate-200 px-3">
            {schoolTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">{goals.map((goal) => <button type="button" key={goal} onClick={() => toggleMulti('goals', goal)} className={`px-3 py-1 rounded-full text-sm border ${form.goals.includes(goal) ? 'bg-cyan-600 text-white border-cyan-600' : 'border-slate-200'}`}>{goal}</button>)}</div>
          <div className="flex flex-wrap gap-2">{SUBJECT_OPTIONS.map((subject) => <button type="button" key={subject} onClick={() => toggleMulti('subjects', subject)} className={`px-3 py-1 rounded-full text-sm border ${form.subjects.includes(subject) ? 'bg-cyan-600 text-white border-cyan-600' : 'border-slate-200'}`}>{subject}</button>)}</div>
          <select value={form.sessionsPerWeek} onChange={(e) => setForm({ ...form, sessionsPerWeek: e.target.value === 'NotSure' ? 'NotSure' : Number(e.target.value) })} className="h-11 rounded-lg border border-slate-200 px-3 max-w-sm">
            <option value={1}>1 per week</option><option value={2}>2 per week</option><option value={3}>3+ per week</option><option value="NotSure">Not sure</option>
          </select>
        </div>
      )}

      {step === 3 && <div className="flex flex-wrap gap-2">{preferences.map((pref) => <button type="button" key={pref} onClick={() => toggleMulti('learningPreferences', pref)} className={`px-3 py-1 rounded-full text-sm border ${form.learningPreferences.includes(pref) ? 'bg-cyan-600 text-white border-cyan-600' : 'border-slate-200'}`}>{pref}</button>)}</div>}

      {step === 4 && (
        <div>
          <h3 className="text-lg font-semibold">Recommended tutors preview</h3>
          <p className="text-sm text-slate-600 mt-1">We will recommend tutors based on {form.state || 'your state'}, {form.gradeLevel || 'your grade'}, and selected goals.</p>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} className="btn-secondary px-4 py-2 rounded-lg disabled:opacity-50">Back</button>
        {step < 4 ? <button onClick={() => { onSavePartial(form); setStep((s) => s + 1); }} className="btn-primary px-4 py-2 rounded-lg">Next</button> : <button onClick={() => onComplete(form)} className="btn-primary px-4 py-2 rounded-lg">Finish</button>}
      </div>
    </div>
  );
};

export default OnboardingWizard;
