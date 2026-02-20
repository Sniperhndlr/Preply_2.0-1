import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MOCK_TUTORS, US_STATES } from '../../data/marketplaceData';
import TutorCard from '../../components/landing/TutorCard';

const subjectChips = ['math', 'science', 'ela', 'social-studies', 'ap'];
const gradeChips = ['Elementary (3-5)', 'Middle (6-8)', 'High school (9-12)', 'AP/College'];

const StateDetailPage = () => {
  const { code = '', subject = '' } = useParams();
  const upperCode = code.toUpperCase();
  const stateName = US_STATES.find((state) => state.code === upperCode)?.name || upperCode;

  const tutors = useMemo(() => {
    return MOCK_TUTORS.filter((tutor) => {
      if (!tutor.statesCovered.includes(upperCode)) return false;
      if (!subject) return true;
      const normalized = subject.toLowerCase().replace('-', ' ');
      return tutor.subjects.some((item) => item.toLowerCase().includes(normalized));
    });
  }, [upperCode, subject]);

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[220px_1fr] gap-5">
        <aside className="glass-card rounded-2xl p-4 h-fit lg:sticky lg:top-28">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">States</h2>
          <div className="max-h-[420px] overflow-y-auto space-y-1">
            {US_STATES.map((state) => (
              <Link
                key={state.code}
                to={`/state/${state.code}`}
                className={`block rounded-lg px-2.5 py-1.5 text-sm ${state.code === upperCode ? 'bg-cyan-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {state.code} - {state.name}
              </Link>
            ))}
          </div>
        </aside>

        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{stateName} curriculum tutors</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Tutors listed here align lessons to {stateName} standards and school expectations.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {subjectChips.map((chip) => (
              <Link
                key={chip}
                to={`/state/${upperCode}/${chip}`}
                className={`px-3 py-1 rounded-full text-xs border ${subject === chip ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
              >
                {chip.replace('-', ' ').toUpperCase()}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {gradeChips.map((grade) => (
              <span key={grade} className="px-3 py-1 rounded-full text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                {grade}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Featured tutors</h2>
            <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-1">
              {tutors.slice(0, 6).map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
              {tutors.length === 0 && <p className="text-sm text-slate-500">No featured tutors for this filter yet.</p>}
            </div>
            <Link to={`/teachers?state=${upperCode}${subject ? `&subject=${encodeURIComponent(subject.replace('-', ' '))}` : ''}`} className="mt-4 inline-flex btn-secondary px-4 py-2 rounded-lg text-sm">
              View all tutors for {stateName}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StateDetailPage;
