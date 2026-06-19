import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { subjects, locations } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Gift, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BecomeTutor: React.FC = () => {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const f = lang === 'am' ? 'font-ethiopic' : '';
  const [submitted, setSubmitted] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: '✅ ' + (lang === 'am' ? 'ማመልከቻ ተልኳል!' : 'Application Submitted!'),
      description: t.tutorReg.pendingMsg,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-secondary" />
            <h2 className={`text-2xl font-bold mb-3 ${f}`}>
              {lang === 'am' ? 'ማመልከቻ ተልኳል!' : 'Application Submitted!'}
            </h2>
            <p className={`text-muted-foreground ${f}`}>{t.tutorReg.pendingMsg}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${f}`}>{t.tutorReg.title}</h1>
            <p className={`text-muted-foreground mt-2 ${f}`}>{t.tutorReg.subtitle}</p>
          </div>

          {/* Pricing info */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-secondary bg-secondary/5 p-5 text-center">
              <Gift className="mx-auto mb-2 h-8 w-8 text-secondary" />
              <p className={`font-semibold text-secondary ${f}`}>{t.tutorReg.freeSpots}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {lang === 'am' ? '87 ቦታዎች ቀርተዋል' : '87 spots remaining'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <CreditCard className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className={`font-semibold ${f}`}>{t.tutorReg.regFee}: 500 {t.common.etb}</p>
              <p className={`text-sm text-muted-foreground mt-1 ${f}`}>{t.tutorReg.regFeePeriod}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className={f}>{t.auth.fullName}</Label>
                <Input required placeholder={lang === 'am' ? 'ሙሉ ስም' : 'Full Name'} />
              </div>
              <div>
                <Label className={f}>{t.auth.email}</Label>
                <Input required type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label className={f}>{t.auth.phone}</Label>
                <Input required type="tel" placeholder="+251..." />
              </div>
              <div>
                <Label className={f}>{t.tutorReg.experience}</Label>
                <Input required type="number" min={0} placeholder="5" />
              </div>
            </div>

            <div>
              <Label className={`mb-3 block ${f}`}>{t.tutorReg.subjects}</Label>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => {
                  const label = lang === 'am' ? s.am : s.en;
                  const selected = selectedSubjects.includes(s.en);
                  return (
                    <button
                      key={s.en}
                      type="button"
                      onClick={() => toggleSubject(s.en)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        selected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      } ${f}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className={f}>{t.tutorReg.location}</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder={t.search.allLocations} /></SelectTrigger>
                  <SelectContent>
                    {locations.map(l => (
                      <SelectItem key={l.en} value={l.en}>{lang === 'am' ? l.am : l.en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={f}>{t.tutorReg.teachingMode}</Label>
                <Select>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">{t.tutorCard.online}</SelectItem>
                    <SelectItem value="in-person">{t.tutorCard.inPerson}</SelectItem>
                    <SelectItem value="both">{t.tutorCard.both}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className={f}>{t.tutorReg.priceRange}</Label>
              <Input type="number" min={100} placeholder="500" />
            </div>

            <div>
              <Label className={f}>{t.tutorReg.bio}</Label>
              <Textarea rows={4} placeholder={lang === 'am' ? 'ስለ ራስዎ ይንገሩን...' : 'Tell us about yourself...'} />
            </div>

            <div>
              <Label className={f}>{t.tutorReg.certifications}</Label>
              <Input placeholder={lang === 'am' ? 'BSc, MA, ...' : 'BSc, MA, Teaching Certificate...'} />
            </div>

            <Button
              type="submit"
              size="lg"
              className={`w-full bg-gradient-primary text-primary-foreground shadow-gold hover:opacity-90 text-base ${f}`}
            >
              {t.tutorReg.submit}
            </Button>

            <p className={`text-xs text-center text-muted-foreground ${f}`}>{t.tutorReg.pendingMsg}</p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeTutor;
