export interface Booking {
  id: string;
  studentName: string;
  studentEmail: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  feePaid: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface TutorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  location: string;
  experience: number;
  bio: string;
  certifications: string[];
  mode: 'online' | 'in-person' | 'both';
  pricePerSession: number;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    studentName: 'Kidist Mengistu',
    studentEmail: 'kidist@example.com',
    tutorId: '1',
    tutorName: 'Abebe Kebede',
    subject: 'Mathematics',
    date: '2026-02-28',
    time: '10:00 AM',
    feePaid: 100,
    status: 'confirmed',
  },
  {
    id: 'b2',
    studentName: 'Binyam Tadesse',
    studentEmail: 'binyam@example.com',
    tutorId: '2',
    tutorName: 'Sara Tesfaye',
    subject: 'English',
    date: '2026-03-01',
    time: '2:00 PM',
    feePaid: 100,
    status: 'confirmed',
  },
  {
    id: 'b3',
    studentName: 'Liya Asfaw',
    studentEmail: 'liya@example.com',
    tutorId: '6',
    tutorName: 'Meron Alemayehu',
    subject: 'Piano',
    date: '2026-03-02',
    time: '4:00 PM',
    feePaid: 100,
    status: 'pending',
  },
  {
    id: 'b4',
    studentName: 'Naod Bekele',
    studentEmail: 'naod@example.com',
    tutorId: '5',
    tutorName: 'Yonas Tadesse',
    subject: 'Computer Science',
    date: '2026-03-03',
    time: '11:00 AM',
    feePaid: 100,
    status: 'cancelled',
  },
];

export const mockApplications: TutorApplication[] = [
  {
    id: 'a1',
    name: 'Tigist Worku',
    email: 'tigist@example.com',
    phone: '+251911223344',
    subjects: ['Geography', 'Civics'],
    location: 'Adama',
    experience: 3,
    bio: 'Passionate about social sciences and helping students understand the world around them.',
    certifications: ['BA Geography - Adama University'],
    mode: 'both',
    pricePerSession: 350,
    appliedAt: '2026-02-24',
    status: 'pending',
  },
  {
    id: 'a2',
    name: 'Solomon Gebre',
    email: 'solomon@example.com',
    phone: '+251922334455',
    subjects: ['Physics', 'Mathematics'],
    location: 'Jimma',
    experience: 7,
    bio: 'University lecturer offering private tutoring sessions for high school students.',
    certifications: ['MSc Physics - Jimma University', 'Teaching License'],
    mode: 'online',
    pricePerSession: 500,
    appliedAt: '2026-02-25',
    status: 'pending',
  },
  {
    id: 'a3',
    name: 'Rahel Desta',
    email: 'rahel@example.com',
    phone: '+251933445566',
    subjects: ['Art', 'Design'],
    location: 'Addis Ababa',
    experience: 5,
    bio: 'Fine arts graduate with experience teaching children and adults.',
    certifications: ['BFA - Alle School of Fine Arts'],
    mode: 'in-person',
    pricePerSession: 400,
    appliedAt: '2026-02-26',
    status: 'pending',
  },
];
