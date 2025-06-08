export interface User {
  id: string;
  email: string;
  name?: string | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}