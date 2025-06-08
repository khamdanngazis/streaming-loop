export interface VideoAsset {
  id: string;
  userId: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  originalName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}