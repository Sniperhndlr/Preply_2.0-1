import React from 'react';
import { Link } from 'react-router-dom';

const plans = [
  { name: 'Starter', price: '$0', copy: 'Create an account and browse tutors by state and subject.', cta: 'Create free account' },
  { name: 'Learning Plus', price: '$29/mo', copy: 'Priority matching, lesson reminders, and enhanced progress tracking.', cta: 'Start Learning Plus' },
  { name: 'Family', price: '$59/mo', copy: 'Multiple student profiles, shared billing, and flexible scheduling.', cta: 'Choose Family' },
];

const PricingPage = () => (
  <main className="pt-28">
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Simple pricing for every learner</h1>
      <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-2xl">Pick a plan and book tutors aligned to your state standards. You can cancel or switch anytime.</p>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {plans.map((plan) => (
          <article key={plan.name} className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h2>
            <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-300 mt-3">{plan.price}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 min-h-12">{plan.copy}</p>
            <Link to="/register" className="mt-5 inline-flex btn-primary px-4 py-2 rounded-lg text-sm">{plan.cta}</Link>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default PricingPage;
