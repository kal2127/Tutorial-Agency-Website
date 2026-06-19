import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n-context';
import { Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/tutors', label: t.nav.findTutors },
    { path: '/become-tutor', label: t.nav.becomeTutor },
    { path: '/feedback', label: lang === 'am' ? 'አስተያየት' : 'Feedback' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <span className={`text-xl font-bold text-foreground ${lang === 'am' ? 'font-ethiopic' : ''}`}>
            {lang === 'am' ? 'ቱቶር ሊንክ' : 'TutorLink'}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              } ${lang === 'am' ? 'font-ethiopic' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            {lang === 'en' ? 'አማ' : 'EN'}
          </button>
          <Link to="/login">
            <Button variant="ghost" size="sm" className={lang === 'am' ? 'font-ethiopic' : ''}>
              {t.nav.login}
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className={`bg-gradient-primary text-primary-foreground shadow-gold hover:opacity-90 ${lang === 'am' ? 'font-ethiopic' : ''}`}>
              {t.nav.signup}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                } ${lang === 'am' ? 'font-ethiopic' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm"
              >
                <Globe className="h-4 w-4" />
                {lang === 'en' ? 'አማርኛ' : 'English'}
              </button>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm">{t.nav.login}</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="bg-gradient-primary text-primary-foreground">{t.nav.signup}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
