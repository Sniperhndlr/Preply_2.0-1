import React from 'react';
import TutorCard from './TutorCard';

const TopTutorsSection = ({ tutors, state, onViewAll }) => (
  <section className="py-10" aria-label="Top tutors">
    <div className="flex items-end justify-between mb-4 gap-4">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900">Top tutors in your state</h2>
        <p className="text-sm text-slate-600 mt-1">Browse vetted tutors who teach your state standards for your grade level.</p>
      </div>
      <button onClick={onViewAll} className="btn-secondary px-4 py-2 rounded-lg text-sm">View all tutors</button>
    </div>
    <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto pb-1">
      {tutors.slice(0, 8).map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
      {tutors.length === 0 && <p className="text-sm text-slate-500">No tutors available for {state || 'this state'} yet.</p>}
    </div>
  </section>
);

export default TopTutorsSection;
