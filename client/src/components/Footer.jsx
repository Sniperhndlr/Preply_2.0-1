import React from 'react';
import { Link } from 'react-router-dom';

const footerColumns = [
  { title: 'Students', links: [{ label: 'Find tutors', to: '/teachers' }, { label: 'How it works', to: '/#how-it-works' }, { label: 'Pricing', to: '/pricing' }, { label: 'Help center', to: '/help' }] },
  { title: 'Tutors', links: [{ label: 'Become a tutor', to: '/register' }, { label: 'Tutor studio', to: '/tutor/studio' }, { label: 'Tutor guidelines', to: '/help' }] },
  { title: 'Schools & districts', links: [{ label: 'For schools', to: '/for-schools' }, { label: 'Partnerships', to: '/for-schools' }] },
  { title: 'Company', links: [{ label: 'About', to: '/contact' }, { label: 'Blog', to: '/help' }, { label: 'Contact', to: '/contact' }] },
];

const Footer = () => (
  <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-16">
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{column.title}</h3>
            <ul className="space-y-2">
              {column.links.map((item) => (
                <li key={item.label}><Link to={item.to} className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span>Social</span>
          <Link to="/help">Terms</Link>
          <Link to="/help">Privacy</Link>
        </div>
        <p>PreplyUS is an independent service and is not affiliated with any state or government agency.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
