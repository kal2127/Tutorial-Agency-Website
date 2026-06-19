import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { mockTutors, subjects, locations } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TutorCard from '@/components/TutorCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const TutorSearch: React.FC = () => {
  const { t, lang } = useI18n();
  const f = lang === 'am' ? 'font-ethiopic' : '';

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');

  const filtered = useMemo(() => {
    let tutors = [...mockTutors].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tutors = tutors.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.nameAm.includes(q) ||
        t.subjects.some(s => s.toLowerCase().includes(q)) ||
        t.subjectsAm.some(s => s.includes(q))
      );
    }

    if (subjectFilter !== 'all') {
      tutors = tutors.filter(t => t.subjects.includes(subjectFilter));
    }

    if (locationFilter !== 'all') {
      tutors = tutors.filter(t => t.location.includes(locationFilter));
    }

    if (modeFilter !== 'all') {
      tutors = tutors.filter(t => t.mode === modeFilter || t.mode === 'both');
    }

    return tutors;
  }, [searchQuery, subjectFilter, locationFilter, modeFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className={`text-3xl font-bold mb-8 ${f}`}>{t.search.title}</h1>

        {/* Filters */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.hero.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`pl-10 ${f}`}
            />
          </div>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className={f}>
              <SelectValue placeholder={t.search.filterSubject} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className={f}>{t.search.allSubjects}</SelectItem>
              {subjects.map(s => (
                <SelectItem key={s.en} value={s.en}>{lang === 'am' ? s.am : s.en}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className={f}>
              <SelectValue placeholder={t.search.filterLocation} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className={f}>{t.search.allLocations}</SelectItem>
              {locations.map(l => (
                <SelectItem key={l.en} value={l.en}>{lang === 'am' ? l.am : l.en}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className={f}>
              <SelectValue placeholder={t.search.filterMode} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className={f}>{t.search.allModes}</SelectItem>
              <SelectItem value="online">{t.tutorCard.online}</SelectItem>
              <SelectItem value="in-person">{t.tutorCard.inPerson}</SelectItem>
              <SelectItem value="both">{t.tutorCard.both}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className={`mb-6 text-sm text-muted-foreground ${f}`}>
          {filtered.length} {t.search.results}
        </p>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className={`text-muted-foreground ${f}`}>{t.search.noResults}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TutorSearch;
