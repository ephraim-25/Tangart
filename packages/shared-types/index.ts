export interface User {
  id: string;
  email: string;
  role: 'LEARNER' | 'TEACHER' | 'ADMIN';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
}
