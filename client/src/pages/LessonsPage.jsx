import React from 'react';
import { Link } from 'react-router-dom';

const upcoming = [
  { id: 'u1', date: 'Mar 4', time: '4:30 PM', subject: 'Algebra 1', tutor: 'Avery Chen' },
  { id: 'u2', date: 'Mar 6', time: '5:00 PM', subject: 'Biology', tutor: 'Jordan Patel' },
];

const recent = [
  { id: 'r1', date: 'Mar 1', subject: 'US History', tutor: 'Maya Thompson' },
  { id: 'r2', date: 'Feb 27', subject: 'Geometry', tutor: 'Avery Chen' },
];

const LessonsPage = () => (
  <main className="pt-28">
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">My lessons</h1>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Upcoming lessons</h2>
          <div className="space-y-2">
            {upcoming.map((lesson) => (
              <div key={lesson.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                <p className="font-medium text-slate-900 dark:text-white">{lesson.date} • {lesson.time}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{lesson.subject} with {lesson.tutor}</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <Link to="/dashboard" className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">Reschedule</Link>
                  <Link to="/dashboard" className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">Cancel</Link>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Recent lessons</h2>
          <div className="space-y-2">
            {recent.map((lesson) => (
              <div key={lesson.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{lesson.subject}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{lesson.date} • {lesson.tutor}</p>
                </div>
                <Link to="/teachers" className="btn-secondary px-3 py-1.5 rounded-lg text-xs">Rebook</Link>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  </main>
);

export default LessonsPage;
