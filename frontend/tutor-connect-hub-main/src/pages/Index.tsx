import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Mail, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { mockTutors } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TutorCard from '@/components/TutorCard';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

const Index: React.FC = () => {
  const { t, lang } = useI18n();
  const f = lang === 'am' ? 'font-ethiopic' : '';

  const featuredTutors = mockTutors.filter(tutor => tutor.isFeatured);

  const steps = [
    { icon: Search, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
    { icon: BookOpen, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
    { icon: Mail, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="animate-fade-in-up">
              <h1 className={`text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl ${f}`}>
                <span className="text-gradient-gold">{t.hero.title}</span>
              </h1>
              <p className={`mt-5 text-lg text-muted-foreground md:text-xl ${f}`}>
                {t.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/tutors">
                  <Button size="lg" className={`bg-gradient-primary text-primary-foreground shadow-gold hover:opacity-90 text-base px-8 ${f}`}>
                    {t.hero.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/become-tutor">
                  <Button size="lg" variant="outline" className={`border-primary/30 text-primary hover:bg-primary/5 text-base px-8 ${f}`}>
                    {t.hero.ctaSecondary}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block animate-fade-in">
              <img
                src={heroImage}
                alt="Tutor teaching student"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold md:text-4xl ${f}`}>{t.howItWorks.title}</h2>
            <p className={`mt-3 text-muted-foreground text-lg ${f}`}>{t.howItWorks.subtitle}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-border bg-card p-8 text-center transition-all hover:shadow-card-hover"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary shadow-gold">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${f}`}>{step.title}</h3>
                <p className={`text-sm text-muted-foreground ${f}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className={`text-3xl font-bold md:text-4xl ${f}`}>{t.featured.title}</h2>
              <p className={`mt-2 text-muted-foreground ${f}`}>{t.featured.subtitle}</p>
            </div>
            <Link to="/tutors">
              <Button variant="ghost" className={`text-primary ${f}`}>
                {t.featured.viewAll} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
