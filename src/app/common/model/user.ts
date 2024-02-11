export type User = {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  role: 'GUEST' | 'ADMIN' | 'USER';
};
