import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, BookOpen, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { mockTutors } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const TutorDetail: React.FC = () => {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const f = lang === 'am' ? 'font-ethiopic' : '';
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const tutor = mockTutors.find(t => t.id === id);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Tutor not found</p>
          <Link to="/tutors"><Button variant="ghost" className="mt-4">Go back</Button></Link>
        </div>
      </div>
    );
  }

  const name = lang === 'am' ? tutor.nameAm : tutor.name;
  const bio = lang === 'am' ? tutor.bioAm : tutor.bio;
  const subjectsList = lang === 'am' ? tutor.subjectsAm : tutor.subjects;
  const location = lang === 'am' ? tutor.locationAm : tutor.location;
  const modeLabel = tutor.mode === 'online' ? t.tutorCard.online : tutor.mode === 'in-person' ? t.tutorCard.inPerson : t.tutorCard.both;

  const handleBooking = () => {
    setBookingOpen(false);
    setBookingComplete(true);
    toast({
      title: '✅ ' + (lang === 'am' ? 'ቦታ ማስያዣ ተረጋግጧል!' : 'Booking Confirmed!'),
      description: t.tutorDetail.bookingSuccess,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Link to="/tutors" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> {lang === 'am' ? 'ተመለስ' : 'Back to tutors'}
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <img
                  src={tutor.photo}
                  alt={name}
                  className="h-28 w-28 rounded-xl object-cover ring-2 ring-primary/20"
                />
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className={`text-2xl font-bold ${f}`}>{name}</h1>
                    {tutor.isFeatured && (
                      <Badge className={`bg-gradient-primary text-primary-foreground border-0 ${f}`}>
                        ⭐ {t.featured.featured}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> <span className={f}>{location}</span></span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {tutor.experience} {t.tutorCard.years}</span>
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> {tutor.rating}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> <span className={f}>{modeLabel}</span></span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subjectsList.map(s => (
                      <Badge key={s} variant="secondary" className={f}>{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className={`text-lg font-semibold mb-3 ${f}`}>{t.tutorDetail.about}</h2>
                <p className={`text-muted-foreground leading-relaxed ${f}`}>{bio}</p>
              </div>

              <div className="mt-6">
                <h2 className={`text-lg font-semibold mb-3 ${f}`}>{t.tutorDetail.qualifications}</h2>
                <ul className="space-y-2">
                  {tutor.certifications.map(cert => (
                    <li key={cert} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div>
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-primary">{tutor.price} {t.common.etb}</span>
                <span className={`text-muted-foreground ${f}`}>{t.featured.perSession}</span>
              </div>

              <div className="mb-4 rounded-lg bg-muted/50 p-4 text-center">
                <Lock className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                <p className={`text-sm text-muted-foreground ${f}`}>
                  {t.tutorDetail.contactHidden}
                </p>
              </div>

              {bookingComplete ? (
                <div className="rounded-lg bg-secondary/10 p-4 text-center">
                  <CheckCircle className="mx-auto mb-2 h-8 w-8 text-secondary" />
                  <p className={`text-sm font-medium text-secondary ${f}`}>
                    {t.tutorDetail.bookingSuccess}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={() => setBookingOpen(true)}
                  className={`w-full bg-gradient-primary text-primary-foreground shadow-gold hover:opacity-90 text-base py-6 ${f}`}
                  size="lg"
                >
                  {t.tutorDetail.bookSession}
                </Button>
              )}

              <p className={`mt-4 text-xs text-center text-muted-foreground ${f}`}>
                {t.tutorDetail.bookingFee}: {tutor.price} {t.common.etb}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={f}>{t.tutorDetail.bookSession}</DialogTitle>
            <DialogDescription className={f}>
              {t.tutorDetail.bookingFee}: {tutor.price} {t.common.etb}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className={f}>{t.auth.fullName}</Label>
              <Input placeholder={lang === 'am' ? 'ሙሉ ስም' : 'Your full name'} />
            </div>
            <div>
              <Label className={f}>{t.auth.email}</Label>
              <Input type="email" placeholder="email@example.com" />
            </div>
            <div>
              <Label className={f}>{t.tutorDetail.selectDate}</Label>
              <Input type="date" />
            </div>
            <div>
              <Label className={f}>{t.tutorDetail.selectTime}</Label>
              <Input type="time" />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleBooking}
              className={`bg-gradient-primary text-primary-foreground shadow-gold hover:opacity-90 ${f}`}
            >
              {t.tutorDetail.confirmBooking} — {tutor.price} {t.common.etb}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default TutorDetail;
