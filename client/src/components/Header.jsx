import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Wallet, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const balanceHours = ((user?.balance_minutes || 0) / 60).toFixed(1);

  const publicLinks = [
    { name: 'Find tutors', to: '/teachers' },
    { name: 'How it works', to: '/#how-it-works' },
    { name: 'Subjects', to: '/#subjects' },
    { name: 'Pricing', to: '/pricing' },
    { name: 'For schools', to: '/for-schools', hideUntilXl: true },
    { name: 'Get matched', to: '/teachers?match=true', hideUntilXl: true },
    { name: 'Become a tutor', to: '/register', hideUntilXl: true },
  ];

  const authLinks = [
    { name: 'Home', to: '/' },
    { name: 'Messages', to: '/messages' },
    { name: 'My lessons', to: '/dashboard' },
    { name: 'Learn', to: '/learn' },
    { name: 'Settings', to: '/settings' },
    { name: 'For business', to: '/for-schools', hideUntilXl: true },
    ...(user?.role === 'teacher' ? [{ name: 'Tutor studio', to: '/tutor/studio', hideUntilXl: true }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[300] bg-white/95 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] min-h-[72px] flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="text-[2rem] leading-none font-display font-bold text-slate-900 dark:text-white">SyllabusSync</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {(user ? authLinks : publicLinks).map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) => `${link.hideUntilXl ? 'hidden xl:inline-flex' : 'inline-flex'} whitespace-nowrap rounded-lg px-3 py-2 font-medium transition-colors ${isActive ? 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {!user ? (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap">Log in</Link>
                <Link to="/register" className="btn-primary px-4 py-2 rounded-lg text-sm whitespace-nowrap">Sign up</Link>
              </>
            ) : (
              <>
                <div className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  <Wallet className="h-3.5 w-3.5" />
                  <span>BALANCE {balanceHours}h</span>
                </div>
                <Link to="/referral" className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 whitespace-nowrap">
                  <Gift className="h-3.5 w-3.5" /> Get $50 credit
                </Link>
                <button onClick={() => navigate('/profile')} className="h-9 w-9 rounded-full bg-cyan-700 text-white text-sm font-bold shrink-0">{user.name?.[0]?.toUpperCase() || 'U'}</button>
                <button onClick={() => { logout(); navigate('/'); }} className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:text-slate-200 whitespace-nowrap">Sign out</button>
              </>
            )}
          </div>

          <button className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700" onClick={() => setOpen((v) => !v)}>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="mx-auto max-w-[1280px] px-4 py-3 flex flex-col gap-2">
            {(user ? authLinks : publicLinks).map((link) => (
              <NavLink key={link.name} to={link.to} onClick={() => setOpen(false)} className="px-2 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">{link.name}</NavLink>
            ))}
            {user ? (
              <>
                <Link to="/referral" onClick={() => setOpen(false)} className="px-2 py-2 text-sm text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30">Get $50 credit</Link>
                <button onClick={() => { setOpen(false); logout(); navigate('/'); }} className="px-2 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 text-left">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="px-2 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="px-2 py-2 text-sm text-white rounded-lg bg-cyan-700">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
