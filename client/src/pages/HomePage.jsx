import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSearch from '../components/landing/HeroSearch';
import FeatureGrid from '../components/landing/FeatureGrid';
import TopTutorsSection from '../components/landing/TopTutorsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import SubjectTilesSection from '../components/landing/SubjectTilesSection';
import MatchWizard from '../components/MatchWizard';
import { MOCK_TUTORS } from '../data/marketplaceData';

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ subject: '', gradeLevel: '', state: '' });
  const [wizardOpen, setWizardOpen] = useState(false);

  const filteredTopTutors = useMemo(() => {
    return MOCK_TUTORS.filter((tutor) => {
      if (search.state && !tutor.statesCovered.includes(search.state)) return false;
      if (search.subject && !tutor.subjects.some((subject) => subject.toLowerCase().includes(search.subject.toLowerCase()))) return false;
      if (search.gradeLevel && !tutor.gradeLevels.includes(search.gradeLevel)) return false;
      return true;
    });
  }, [search]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.subject) params.set('subject', search.subject);
    if (search.gradeLevel) params.set('gradeLevel', search.gradeLevel);
    if (search.state) params.set('state', search.state);
    navigate(`/teachers${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleMatchSubmit = (data) => {
    setWizardOpen(false);
    const params = new URLSearchParams();
    params.set('subject', data.subject);
    params.set('gradeLevel', data.gradeLevel);
    params.set('state', data.state);
    params.set('match', 'true');
    navigate(`/teachers?${params.toString()}`);
  };

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-100">US Curriculum Tutoring Marketplace</p>
            <h1 className="mt-5 text-5xl leading-tight font-display font-bold text-slate-900">US curriculum tutors, by state standards</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl">Find expert online tutors for Math, Science, ELA, Social Studies, and AP courses, matched to your exact state syllabus.</p>
            <div className="mt-6"><HeroSearch values={search} onChange={setSearch} onSearch={handleSearch} onAutoMatch={() => setWizardOpen(true)} onUseLocation={() => setSearch((prev) => ({ ...prev, state: 'NC' }))} onStateChip={(state) => setSearch((prev) => ({ ...prev, state }))} /></div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Live marketplace snapshot</h2>
            <div className="space-y-3">
              {filteredTopTutors.slice(0, 3).map((tutor) => (
                <div key={tutor.id} className="rounded-xl border border-slate-200 p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{tutor.name}</p>
                      <p className="text-xs text-slate-500">{tutor.subjects[0]} • {tutor.statesCovered[0]}</p>
                    </div>
                    <p className="text-sm font-semibold text-cyan-700">${tutor.hourlyRate}/hr</p>
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <p className="text-xs text-slate-500">Next lesson</p>
                <p className="text-sm font-semibold text-slate-900">Thu, 4:30 PM • Algebra 1</p>
                <p className="text-xs text-slate-600">with a NC standards tutor</p>
              </div>
            </div>
          </div>
        </div>

        <FeatureGrid />
        <TopTutorsSection tutors={filteredTopTutors} state={search.state} onViewAll={handleSearch} />
        <HowItWorksSection />
        <SubjectTilesSection />
      </section>

      <MatchWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onSubmit={handleMatchSubmit} />
    </main>
  );
};

export default HomePage;
