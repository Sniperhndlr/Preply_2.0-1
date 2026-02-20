import React from 'react';
import { Link } from 'react-router-dom';
import { POPULAR_SUBJECTS } from '../../data/marketplaceData';

const SubjectTilesSection = () => (
  <section id="subjects" className="py-14" aria-label="Popular subjects">
    <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Popular subjects</h2>
    <p className="text-sm text-slate-600 mb-6">Choose a popular subject to explore matching tutors instantly.</p>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {POPULAR_SUBJECTS.map((subject) => (
        <Link key={subject} to={`/teachers?subject=${encodeURIComponent(subject)}`} className="glass-card rounded-xl p-4 text-sm font-medium text-slate-800 hover:border-cyan-300">
          {subject}
        </Link>
      ))}
    </div>
  </section>
);

export default SubjectTilesSection;
