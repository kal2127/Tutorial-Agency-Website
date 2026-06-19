export interface Tutor {
  id: string;
  name: string;
  nameAm: string;
  photo: string;
  subjects: string[];
  subjectsAm: string[];
  location: string;
  locationAm: string;
  experience: number;
  rating: number;
  price: number;
  bio: string;
  bioAm: string;
  mode: 'online' | 'in-person' | 'both';
  isFeatured: boolean;
  certifications: string[];
}

export const mockTutors: Tutor[] = [
  {
    id: '1',
    name: 'Abebe Kebede',
    nameAm: 'አበበ ከበደ',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    subjects: ['Mathematics', 'Physics'],
    subjectsAm: ['ሒሳብ', 'ፊዚክስ'],
    location: 'Addis Ababa, Bole',
    locationAm: 'አዲስ አበባ፣ ቦሌ',
    experience: 8,
    rating: 4.9,
    price: 500,
    bio: 'Experienced math and physics tutor with 8 years of teaching. Specialized in preparing students for national exams.',
    bioAm: 'ከ8 ዓመታት የማስተማር ልምድ ያለው የሒሳብ እና ፊዚክስ አስተማሪ። ተማሪዎችን ለብሔራዊ ፈተና ለማዘጋጀት ልዩ ችሎታ ያለው።',
    mode: 'both',
    isFeatured: true,
    certifications: ['BSc Mathematics - AAU', 'Teaching Certificate'],
  },
  {
    id: '2',
    name: 'Sara Tesfaye',
    nameAm: 'ሳራ ተስፋዬ',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    subjects: ['English', 'Literature'],
    subjectsAm: ['እንግሊዝኛ', 'ሥነ ጽሑፍ'],
    location: 'Addis Ababa, Kazanchis',
    locationAm: 'አዲስ አበባ፣ ቃዝንችስ',
    experience: 5,
    rating: 4.8,
    price: 400,
    bio: 'Passionate English teacher helping students build confidence in reading, writing, and speaking.',
    bioAm: 'ተማሪዎችን በንባብ፣ በጽሑፍ እና በንግግር እንዲተማመኑ የሚያደርግ ታታሪ የእንግሊዝኛ አስተማሪ።',
    mode: 'online',
    isFeatured: true,
    certifications: ['MA English Literature', 'TEFL Certificate'],
  },
  {
    id: '3',
    name: 'Dawit Haile',
    nameAm: 'ዳዊት ሃይሌ',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    subjects: ['Chemistry', 'Biology'],
    subjectsAm: ['ኬሚስትሪ', 'ባዮሎጂ'],
    location: 'Bahir Dar',
    locationAm: 'ባህር ዳር',
    experience: 10,
    rating: 4.7,
    price: 450,
    bio: 'Senior science tutor with laboratory experience. Makes complex concepts simple and engaging.',
    bioAm: 'ከላብራቶሪ ልምድ ጋር ከፍተኛ ደረጃ ያለው የሳይንስ አስተማሪ።',
    mode: 'in-person',
    isFeatured: false,
    certifications: ['MSc Chemistry - BDU'],
  },
  {
    id: '4',
    name: 'Hana Girma',
    nameAm: 'ሀና ግርማ',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    subjects: ['Amharic', 'History'],
    subjectsAm: ['አማርኛ', 'ታሪክ'],
    location: 'Hawassa',
    locationAm: 'ሀዋሳ',
    experience: 6,
    rating: 4.6,
    price: 350,
    bio: 'Dedicated Amharic and history tutor helping students excel in humanities.',
    bioAm: 'ተማሪዎችን በሰብዓዊ ሳይንስ እንዲሻሻሉ የሚረዳ የተሰጠ የአማርኛ እና ታሪክ አስተማሪ።',
    mode: 'both',
    isFeatured: true,
    certifications: ['BA History - HU'],
  },
  {
    id: '5',
    name: 'Yonas Tadesse',
    nameAm: 'ዮናስ ታደሰ',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    subjects: ['Computer Science', 'Mathematics'],
    subjectsAm: ['ኮምፒውተር ሳይንስ', 'ሒሳብ'],
    location: 'Addis Ababa, Megenagna',
    locationAm: 'አዲስ አበባ፣ መገናኛ',
    experience: 4,
    rating: 4.5,
    price: 600,
    bio: 'Software engineer turned tutor. Teaching programming and advanced mathematics to high school and university students.',
    bioAm: 'ወደ አስተማሪነት የተቀየረ የሶፍትዌር ኢንጂነር። ለሁለተኛ ደረጃ እና ዩኒቨርሲቲ ተማሪዎች ፕሮግራሚንግ እና ከፍተኛ ሒሳብ ያስተምራል።',
    mode: 'online',
    isFeatured: false,
    certifications: ['BSc Computer Science - AAIT'],
  },
  {
    id: '6',
    name: 'Meron Alemayehu',
    nameAm: 'ሜሮን አለማየሁ',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
    subjects: ['Music', 'Piano'],
    subjectsAm: ['ሙዚቃ', 'ፒያኖ'],
    location: 'Addis Ababa, CMC',
    locationAm: 'አዲስ አበባ፣ ሲኤምሲ',
    experience: 12,
    rating: 4.9,
    price: 700,
    bio: 'Professional pianist offering music lessons for all ages. From beginner to advanced levels.',
    bioAm: 'ለሁሉም ዕድሜዎች የሙዚቃ ትምህርት የሚያቀርብ ባለሙያ ፒያኖ ተጫዋች።',
    mode: 'in-person',
    isFeatured: true,
    certifications: ['Yared School of Music'],
  },
];

export const subjects = [
  { en: 'Mathematics', am: 'ሒሳብ' },
  { en: 'Physics', am: 'ፊዚክስ' },
  { en: 'Chemistry', am: 'ኬሚስትሪ' },
  { en: 'Biology', am: 'ባዮሎጂ' },
  { en: 'English', am: 'እንግሊዝኛ' },
  { en: 'Amharic', am: 'አማርኛ' },
  { en: 'History', am: 'ታሪክ' },
  { en: 'Computer Science', am: 'ኮምፒውተር ሳይንስ' },
  { en: 'Music', am: 'ሙዚቃ' },
  { en: 'Literature', am: 'ሥነ ጽሑፍ' },
  { en: 'Piano', am: 'ፒያኖ' },
];

export const locations = [
  { en: 'Addis Ababa', am: 'አዲስ አበባ' },
  { en: 'Bahir Dar', am: 'ባህር ዳር' },
  { en: 'Hawassa', am: 'ሀዋሳ' },
  { en: 'Dire Dawa', am: 'ድሬ ዳዋ' },
  { en: 'Mekelle', am: 'መቀሌ' },
];
