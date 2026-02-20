import React from 'react';
import { Star } from 'lucide-react';
import { buildTutorProfileRoute } from '../../data/marketplaceData';
import { Link } from 'react-router-dom';

const TutorCard = ({ tutor }) => (
  <article className="glass-card rounded-2xl p-4 min-w-[270px]">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-10 w-10 rounded-xl bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center">{tutor.name[0]}</div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">{tutor.name}</h4>
        <p className="text-xs text-slate-500">{tutor.statesCovered[0]} - {tutor.standardsTags[0]}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5 mb-3">
      {tutor.subjects.slice(0, 3).map((subject) => <span key={subject} className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-700">{subject}</span>)}
    </div>
    <div className="flex flex-wrap gap-1.5 mb-3">
      {tutor.badges?.slice(0, 2).map((badge) => <span key={badge} className="text-[10px] px-2 py-1 rounded-full border border-slate-200 text-slate-600">{badge}</span>)}
    </div>
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-900">${tutor.hourlyRate}/hr</p>
      <p className="text-xs text-slate-600 inline-flex items-center"><Star className="h-3.5 w-3.5 text-amber-400 mr-1" />{tutor.rating} ({tutor.ratingCount})</p>
    </div>
    <Link to={buildTutorProfileRoute(tutor.id)} className="mt-3 block text-center rounded-lg border border-cyan-600 text-cyan-700 py-2 text-sm font-medium hover:bg-cyan-50">View profile</Link>
  </article>
);

export default TutorCard;
