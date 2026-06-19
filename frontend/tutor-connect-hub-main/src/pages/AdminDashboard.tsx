import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n-context';
import { mockBookings, mockApplications, Booking, TutorApplication } from '@/lib/mock-admin-data';
import { getFeedback, markFeedbackRead, Feedback } from '@/lib/mock-feedback-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { CalendarDays, Users, ClipboardCheck, LogOut, CheckCircle, XCircle, Eye, MessageSquare, Mail, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AdminDashboard: React.FC = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [bookings] = useState<Booking[]>(mockBookings);
  const [applications, setApplications] = useState<TutorApplication[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<TutorApplication | null>(null);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(getFeedback());
  const am = lang === 'am';
  const cls = am ? 'font-ethiopic' : '';

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const handleApprove = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    setSelectedApp(null);
  };

  const handleReject = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    setSelectedApp(null);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      confirmed: 'bg-secondary/15 text-secondary',
      pending: 'bg-primary/15 text-primary',
      cancelled: 'bg-destructive/15 text-destructive',
      approved: 'bg-secondary/15 text-secondary',
      rejected: 'bg-destructive/15 text-destructive',
    };
    return <Badge className={`${map[status] || ''} border-0 capitalize`}>{status}</Badge>;
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const unreadFeedback = feedbackList.filter(f => !f.read).length;

  const handleMarkRead = (id: string) => {
    markFeedbackRead(id);
    setFeedbackList(getFeedback());
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold text-foreground ${cls}`}>
                {am ? 'የአስተዳዳሪ ዳሽቦርድ' : 'Admin Dashboard'}
              </h1>
              <p className={`text-muted-foreground ${cls}`}>
                {am ? 'ቦታ ማስያዣዎችን እና ማመልከቻዎችን ያስተዳድሩ' : 'Manage bookings and tutor applications'}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              {am ? 'ውጣ' : 'Logout'}
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className={`text-sm text-muted-foreground ${cls}`}>{am ? 'ጠቅላላ ቦታ ማስያዣ' : 'Total Bookings'}</p>
                  <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className={`text-sm text-muted-foreground ${cls}`}>{am ? 'ጠቅላላ ማመልከቻ' : 'Tutor Applications'}</p>
                  <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <ClipboardCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className={`text-sm text-muted-foreground ${cls}`}>{am ? 'በመጠባበቅ ላይ' : 'Pending Review'}</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className={`text-sm text-muted-foreground ${cls}`}>{am ? 'አስተያየቶች' : 'Feedback'}</p>
                  <p className="text-2xl font-bold text-foreground">{feedbackList.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings">
            <TabsList className="mb-4">
              <TabsTrigger value="bookings" className={cls}>
                {am ? 'ቦታ ማስያዣዎች' : 'Bookings'}
              </TabsTrigger>
              <TabsTrigger value="applications" className={cls}>
                {am ? 'ማመልከቻዎች' : 'Applications'}
                {pendingCount > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="feedback" className={cls}>
                {am ? 'አስተያየቶች' : 'Feedback'}
                {unreadFeedback > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {unreadFeedback}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className={cls}>{am ? 'የቦታ ማስያዣ ዝርዝር' : 'Booking Records'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={cls}>{am ? 'ተማሪ' : 'Student'}</TableHead>
                        <TableHead className={cls}>{am ? 'ኢሜል' : 'Email'}</TableHead>
                        <TableHead className={cls}>{am ? 'አስተማሪ' : 'Tutor'}</TableHead>
                        <TableHead className={cls}>{am ? 'ትምህርት' : 'Subject'}</TableHead>
                        <TableHead className={cls}>{am ? 'ቀን' : 'Date'}</TableHead>
                        <TableHead className={cls}>{am ? 'ክፍያ' : 'Fee'}</TableHead>
                        <TableHead className={cls}>{am ? 'ሁኔታ' : 'Status'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map(b => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.studentName}</TableCell>
                          <TableCell className="text-muted-foreground">{b.studentEmail}</TableCell>
                          <TableCell>{b.tutorName}</TableCell>
                          <TableCell>{b.subject}</TableCell>
                          <TableCell>{b.date} · {b.time}</TableCell>
                          <TableCell>{b.feePaid} {am ? 'ብር' : 'ETB'}</TableCell>
                          <TableCell>{statusBadge(b.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className={cls}>{am ? 'የአስተማሪ ማመልከቻዎች' : 'Tutor Applications'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={cls}>{am ? 'ስም' : 'Name'}</TableHead>
                        <TableHead className={cls}>{am ? 'ትምህርቶች' : 'Subjects'}</TableHead>
                        <TableHead className={cls}>{am ? 'ቦታ' : 'Location'}</TableHead>
                        <TableHead className={cls}>{am ? 'ልምድ' : 'Experience'}</TableHead>
                        <TableHead className={cls}>{am ? 'ሁኔታ' : 'Status'}</TableHead>
                        <TableHead className={cls}>{am ? 'ድርጊት' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map(a => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.name}</TableCell>
                          <TableCell>{a.subjects.join(', ')}</TableCell>
                          <TableCell>{a.location}</TableCell>
                          <TableCell>{a.experience} {am ? 'ዓመት' : 'yrs'}</TableCell>
                          <TableCell>{statusBadge(a.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedApp(a)} className="gap-1">
                                <Eye className="h-3.5 w-3.5" />
                                {am ? 'ይመልከቱ' : 'View'}
                              </Button>
                              {a.status === 'pending' && (
                                <>
                                  <Button size="sm" onClick={() => handleApprove(a.id)} className="gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleReject(a.id)} className="gap-1">
                                    <XCircle className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className={cls}>{am ? 'የተጠቃሚ አስተያየቶች' : 'User Feedback'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {feedbackList.length === 0 ? (
                    <p className={`text-center text-muted-foreground py-8 ${cls}`}>
                      {am ? 'ምንም አስተያየት የለም።' : 'No feedback received yet.'}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {feedbackList.map(f => (
                        <div key={f.id} className={`rounded-lg border p-4 ${!f.read ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-foreground">{f.name}</span>
                                <span className="text-xs text-muted-foreground">{f.email}</span>
                                {!f.read && <Badge className="bg-primary/15 text-primary border-0 text-[10px]">{am ? 'አዲስ' : 'New'}</Badge>}
                              </div>
                              <div className="flex gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} className={`h-4 w-4 ${f.rating >= s ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                                ))}
                              </div>
                              <p className="text-sm text-foreground">{f.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{f.submittedAt}</p>
                            </div>
                            {!f.read && (
                              <Button size="sm" variant="outline" onClick={() => handleMarkRead(f.id)} className="gap-1 shrink-0">
                                <Mail className="h-3.5 w-3.5" />
                                {am ? 'ተነበበ' : 'Mark Read'}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        {selectedApp && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className={cls}>{am ? 'ማመልከቻ ዝርዝር' : 'Application Details'}</DialogTitle>
              <DialogDescription>{selectedApp.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">{am ? 'ኢሜል' : 'Email'}:</span> {selectedApp.email}</div>
                <div><span className="text-muted-foreground">{am ? 'ስልክ' : 'Phone'}:</span> {selectedApp.phone}</div>
                <div><span className="text-muted-foreground">{am ? 'ቦታ' : 'Location'}:</span> {selectedApp.location}</div>
                <div><span className="text-muted-foreground">{am ? 'ዘዴ' : 'Mode'}:</span> {selectedApp.mode}</div>
                <div><span className="text-muted-foreground">{am ? 'ልምድ' : 'Experience'}:</span> {selectedApp.experience} {am ? 'ዓመት' : 'years'}</div>
                <div><span className="text-muted-foreground">{am ? 'ዋጋ' : 'Price'}:</span> {selectedApp.pricePerSession} {am ? 'ብር' : 'ETB'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">{am ? 'ትምህርቶች' : 'Subjects'}:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedApp.subjects.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">{am ? 'ስለ እርሷ/እርሱ' : 'Bio'}:</span>
                <p className="mt-1 text-foreground">{selectedApp.bio}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{am ? 'የምስክር ወረቀቶች' : 'Certifications'}:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedApp.certifications.map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">{am ? 'ሁኔታ' : 'Status'}:</span> {statusBadge(selectedApp.status)}
              </div>
            </div>
            {selectedApp.status === 'pending' && (
              <DialogFooter className="gap-2">
                <Button variant="destructive" onClick={() => handleReject(selectedApp.id)}>
                  <XCircle className="mr-1.5 h-4 w-4" /> {am ? 'ውድቅ አድርግ' : 'Reject'}
                </Button>
                <Button onClick={() => handleApprove(selectedApp.id)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <CheckCircle className="mr-1.5 h-4 w-4" /> {am ? 'አጽድቅ' : 'Approve'}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

// Helper used inside the component — re-declared at module level for the dialog
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    confirmed: 'bg-secondary/15 text-secondary',
    pending: 'bg-primary/15 text-primary',
    cancelled: 'bg-destructive/15 text-destructive',
    approved: 'bg-secondary/15 text-secondary',
    rejected: 'bg-destructive/15 text-destructive',
  };
  return <Badge className={`${map[status] || ''} border-0 capitalize`}>{status}</Badge>;
};

export default AdminDashboard;
