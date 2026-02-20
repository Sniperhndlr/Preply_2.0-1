import React from 'react';

const LearnPage = () => (
  <main className="pt-28">
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Learn</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Browse guided learning paths and review topic checklists between lessons.</p>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {['Math skills refresh', 'Science exam prep', 'ELA writing drills'].map((module) => (
          <article key={module} className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white">{module}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Structured activities designed to support your tutoring sessions.</p>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default LearnPage;
