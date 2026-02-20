import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('studentOnboardingDraft');
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  });

  const handleSavePartial = (payload) => {
    setSaved(payload);
    localStorage.setItem('studentOnboardingDraft', JSON.stringify(payload));
  };

  const handleComplete = (payload) => {
    localStorage.setItem('studentOnboardingComplete', JSON.stringify(payload));
    localStorage.removeItem('studentOnboardingDraft');
    navigate('/teachers');
  };

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Student onboarding</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Tell us your goals and we will recommend tutors aligned to your state and grade level.</p>
        <OnboardingWizard initial={saved} onSavePartial={handleSavePartial} onComplete={handleComplete} />
      </section>
    </main>
  );
};

export default OnboardingPage;
