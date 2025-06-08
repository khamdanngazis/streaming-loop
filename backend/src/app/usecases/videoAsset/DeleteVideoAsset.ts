import { VideoAssetRepository } from "../../../domain/interfaces/VideoAssetRepository";
export class DeleteVideoAsset {
  constructor(private videoRepo: VideoAssetRepository) {}
  async execute(videoId: string) {
    return this.videoRepo.softDelete(videoId);
  }
}