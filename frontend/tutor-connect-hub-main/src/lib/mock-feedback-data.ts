export interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  submittedAt: string;
  read: boolean;
}

// Shared store so the feedback page and admin dashboard stay in sync
let feedbackStore: Feedback[] = [
  {
    id: 'f1',
    name: 'Kidist Mengistu',
    email: 'kidist@example.com',
    message: 'Great platform! Found an excellent math tutor for my son within a day.',
    rating: 5,
    submittedAt: '2026-02-25',
    read: false,
  },
  {
    id: 'f2',
    name: 'Binyam Tadesse',
    email: 'binyam@example.com',
    message: 'The booking process is smooth, but I wish there were more tutors in Hawassa.',
    rating: 4,
    submittedAt: '2026-02-26',
    read: false,
  },
];

export const getFeedback = () => feedbackStore;

export const addFeedback = (fb: Omit<Feedback, 'id' | 'submittedAt' | 'read'>) => {
  const newFb: Feedback = {
    ...fb,
    id: `f${Date.now()}`,
    submittedAt: new Date().toISOString().split('T')[0],
    read: false,
  };
  feedbackStore = [newFb, ...feedbackStore];
  return newFb;
};

export const markFeedbackRead = (id: string) => {
  feedbackStore = feedbackStore.map(f => f.id === id ? { ...f, read: true } : f);
};
