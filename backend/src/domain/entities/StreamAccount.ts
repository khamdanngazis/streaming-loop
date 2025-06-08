export interface StreamAccount {
  id: string;
  userId: string;
  provider: string;
  accountName: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}