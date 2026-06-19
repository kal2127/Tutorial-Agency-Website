import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { Tutor } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  const { t, lang } = useI18n();
  const f = lang === 'am' ? 'font-ethiopic' : '';

  const name = lang === 'am' ? tutor.nameAm : tutor.name;
  const subjects = lang === 'am' ? tutor.subjectsAm : tutor.subjects;
  const location = lang === 'am' ? tutor.locationAm : tutor.location;
  const modeLabel = tutor.mode === 'online' ? t.tutorCard.online : tutor.mode === 'in-person' ? t.tutorCard.inPerson : t.tutorCard.both;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {tutor.isFeatured && (
        <div className="absolute right-3 top-3 z-10">
          <Badge className={`bg-gradient-primary text-primary-foreground border-0 ${f}`}>
            ⭐ {t.featured.featured}
          </Badge>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          <img
            src={tutor.photo}
            alt={name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-card-foreground truncate ${f}`}>{name}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className={`truncate ${f}`}>{location}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-medium">{tutor.rating}</span>
              <span className="text-sm text-muted-foreground">· {tutor.experience} {t.tutorCard.years}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {subjects.map(sub => (
            <span
              key={sub}
              className={`rounded-md bg-secondary/50 px-2 py-0.5 text-xs font-medium text-secondary-foreground ${f}`}
            >
              {sub}
            </span>
          ))}
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {modeLabel}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">{tutor.price} {t.common.etb}</span>
            <span className={`text-sm text-muted-foreground ${f}`}>{t.featured.perSession}</span>
          </div>
          <Link to={`/tutors/${tutor.id}`}>
            <Button size="sm" className={`bg-gradient-primary text-primary-foreground shadow-gold hover:opacity-90 ${f}`}>
              {t.featured.bookNow}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
