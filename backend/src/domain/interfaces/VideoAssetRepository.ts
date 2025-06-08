import { VideoAsset } from "../entities/VideoAsset";
export interface VideoAssetRepository {
  create(data: Omit<VideoAsset, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<VideoAsset>;
  findById(id: string): Promise<VideoAsset | null>;
  softDelete(id: string): Promise<void>;
  findAllByUser(userId: string): Promise<VideoAsset[]>;
}