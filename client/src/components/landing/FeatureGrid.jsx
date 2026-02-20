import React from 'react';
import { MapPinned, Video, Search, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: MapPinned,
    title: 'State-Accurate Learning',
    description: 'Every tutor lists the states and grade levels they cover, so you know each lesson follows the right curriculum.',
  },
  {
    icon: Video,
    title: 'Live 1-on-1 Lessons',
    description: 'Meet in private online sessions with clear goals, structured plans, and ongoing feedback from your tutor.',
  },
  {
    icon: Search,
    title: 'Fast Tutor Discovery',
    description: 'Search, filter, and compare in minutes, then book with a click, no long forms or phone calls.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Track topics you have mastered and see where you still need practice, so every session moves you forward.',
  },
];

const FeatureGrid = () => (
  <section className="py-14" aria-label="Features">
    <div className="grid md:grid-cols-2 gap-5">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <article key={feature.title} className="glass-card rounded-2xl p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 mb-4">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </article>
        );
      })}
    </div>
  </section>
);

export default FeatureGrid;
