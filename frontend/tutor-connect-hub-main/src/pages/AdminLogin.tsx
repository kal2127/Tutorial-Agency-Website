import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// NOTE: This is a frontend-only mock. In production, admin auth must be server-side validated.
const MOCK_ADMIN = { email: 'admin@tutorlink.et', password: 'admin123' };

const AdminLogin: React.FC = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError(lang === 'am' ? 'ኢሜል ወይም የይለፍ ቃል ትክክል አይደለም' : 'Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className={`text-2xl ${lang === 'am' ? 'font-ethiopic' : ''}`}>
              {lang === 'am' ? 'የአስተዳዳሪ መግቢያ' : 'Admin Login'}
            </CardTitle>
            <CardDescription className={lang === 'am' ? 'font-ethiopic' : ''}>
              {lang === 'am' ? 'ወደ አስተዳዳሪ ዳሽቦርድ ይግቡ' : 'Sign in to the admin dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label>{lang === 'am' ? 'ኢሜል' : 'Email'}</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>{lang === 'am' ? 'የይለፍ ቃል' : 'Password'}</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground">
                {lang === 'am' ? 'ግባ' : 'Sign In'}
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo: admin@tutorlink.et / admin123
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
