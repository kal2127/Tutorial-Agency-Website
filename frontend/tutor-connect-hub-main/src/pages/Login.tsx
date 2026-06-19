import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const { t, lang } = useI18n();
  const f = lang === 'am' ? 'font-ethiopic' : '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold ${f}`}>{t.auth.loginTitle}</h1>
            <p className={`text-muted-foreground mt-2 ${f}`}>{t.auth.loginSubtitle}</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label className={f}>{t.auth.email}</Label>
              <Input type="email" placeholder="email@example.com" />
            </div>
            <div>
              <Label className={f}>{t.auth.password}</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button className={`w-full bg-gradient-primary text-primary-foreground shadow-gold hover:opacity-90 ${f}`}>
              {t.auth.login}
            </Button>
          </div>
          <p className={`mt-6 text-center text-sm text-muted-foreground ${f}`}>
            {t.auth.noAccount}{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">{t.nav.signup}</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
