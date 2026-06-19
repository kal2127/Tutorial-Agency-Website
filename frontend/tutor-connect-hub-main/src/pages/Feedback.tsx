import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { addFeedback } from '@/lib/mock-feedback-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Star, Send } from 'lucide-react';

const Feedback: React.FC = () => {
  const { lang } = useI18n();
  const { toast } = useToast();
  const am = lang === 'am';
  const cls = am ? 'font-ethiopic' : '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || rating === 0) {
      toast({ title: am ? 'ሁሉንም መስኮች ይሙሉ' : 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      addFeedback({ name: name.trim(), email: email.trim(), message: message.trim(), rating });
      toast({ title: am ? 'አስተያየትዎ ተልኳል!' : 'Feedback submitted!', description: am ? 'አመሰግናለሁ።' : 'Thank you for your feedback.' });
      setName(''); setEmail(''); setMessage(''); setRating(0);
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="container mx-auto max-w-xl">
          <Card className="border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className={`text-2xl font-bold text-foreground ${cls}`}>
                {am ? 'አስተያየት ይስጡ' : 'Give Us Your Feedback'}
              </CardTitle>
              <p className={`text-muted-foreground ${cls}`}>
                {am ? 'ልምድዎን ያጋሩን ያ አገልግሎታችንን ያሻሽላል።' : 'Share your experience to help us improve.'}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className={cls}>{am ? 'ስም' : 'Name'}</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder={am ? 'ሙሉ ስምዎ' : 'Your full name'} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label className={cls}>{am ? 'ኢሜል' : 'Email'}</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={am ? 'ኢሜልዎ' : 'your@email.com'} maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label className={cls}>{am ? 'ደረጃ' : 'Rating'}</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoveredStar(s)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 ${(hoveredStar || rating) >= s ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className={cls}>{am ? 'መልዕክት' : 'Message'}</Label>
                  <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={am ? 'አስተያየትዎን ይጻፉ...' : 'Write your feedback...'} rows={4} maxLength={1000} />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={submitting}>
                  <Send className="h-4 w-4" />
                  {submitting ? (am ? 'በመላክ ላይ...' : 'Sending...') : (am ? 'አስተያየት ላክ' : 'Submit Feedback')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;
