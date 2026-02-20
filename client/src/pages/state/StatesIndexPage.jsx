import React from 'react';
import { Link } from 'react-router-dom';
import { US_STATES } from '../../data/marketplaceData';

const StatesIndexPage = () => (
  <main className="pt-28">
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Browse by state</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-6">Select a state to find tutors aligned to local standards and curriculum priorities.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {US_STATES.map((state) => (
          <Link
            key={state.code}
            to={`/state/${state.code}`}
            className="glass-card rounded-xl px-4 py-3 hover:border-cyan-400 transition"
          >
            <p className="font-semibold text-slate-900 dark:text-white">{state.code}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{state.name}</p>
          </Link>
        ))}
      </div>
    </section>
  </main>
);

export default StatesIndexPage;
