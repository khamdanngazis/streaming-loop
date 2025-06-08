import { VideoAssetRepository } from "../../../domain/interfaces/VideoAssetRepository";
import { VideoAsset } from "../../../domain/entities/VideoAsset";

export class UploadVideoAsset {
  constructor(private videoRepo: VideoAssetRepository) {}
  async execute(data: Omit<VideoAsset, "id" | "createdAt" | "updatedAt">): Promise<VideoAsset> {
    return await this.videoRepo.create(data);
  }
}