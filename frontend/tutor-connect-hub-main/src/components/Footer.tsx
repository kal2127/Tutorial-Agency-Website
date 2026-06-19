import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n-context';

const Footer: React.FC = () => {
  const { t, lang } = useI18n();
  const f = lang === 'am' ? 'font-ethiopic' : '';

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
                <span className="text-lg font-bold text-primary-foreground">T</span>
              </div>
              <span className={`text-xl font-bold ${f}`}>
                {lang === 'am' ? 'ቱቶር ሊንክ' : 'TutorLink'}
              </span>
            </div>
            <p className={`text-sm text-muted-foreground ${f}`}>{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className={`mb-3 font-semibold ${f}`}>{t.footer.quickLinks}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/tutors" className={`text-sm text-muted-foreground hover:text-primary ${f}`}>{t.nav.findTutors}</Link>
              <Link to="/become-tutor" className={`text-sm text-muted-foreground hover:text-primary ${f}`}>{t.nav.becomeTutor}</Link>
            </div>
          </div>

          <div>
            <h4 className={`mb-3 font-semibold ${f}`}>{t.footer.support}</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className={`text-sm text-muted-foreground hover:text-primary ${f}`}>{t.footer.contact}</a>
              <a href="#" className={`text-sm text-muted-foreground hover:text-primary ${f}`}>{t.footer.faq}</a>
            </div>
          </div>

          <div>
            <h4 className={`mb-3 font-semibold ${f}`}>{t.footer.support}</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className={`text-sm text-muted-foreground hover:text-primary ${f}`}>{t.footer.terms}</a>
              <a href="#" className={`text-sm text-muted-foreground hover:text-primary ${f}`}>{t.footer.privacy}</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className={`text-sm text-muted-foreground ${f}`}>
            © {new Date().getFullYear()} TutorLink. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
