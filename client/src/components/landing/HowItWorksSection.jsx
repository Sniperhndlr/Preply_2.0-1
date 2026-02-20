import React from 'react';
import { MapPin, Users, CalendarCheck2 } from 'lucide-react';

const steps = [
  { icon: MapPin, title: 'Tell us your state, grade, and subject.' },
  { icon: Users, title: 'Browse tutors or get an instant match based on your needs.' },
  { icon: CalendarCheck2, title: 'Schedule lessons, meet online, and track your progress.' },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-14" aria-label="How it works">
    <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">How PreplyUS works</h2>
    <p className="text-sm text-slate-600 mb-6">Three simple steps to start improving today.</p>
    <div className="grid md:grid-cols-3 gap-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <article key={step.title} className="glass-card rounded-2xl p-5">
            <div className="h-9 w-9 rounded-full bg-cyan-600 text-white text-sm font-bold flex items-center justify-center mb-3">{index + 1}</div>
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 mb-3"><Icon className="h-4 w-4" /></div>
            <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
          </article>
        );
      })}
    </div>
  </section>
);

export default HowItWorksSection;
