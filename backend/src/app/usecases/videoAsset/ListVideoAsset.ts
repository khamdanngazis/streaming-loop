import { VideoAssetRepository } from "../../../domain/interfaces/VideoAssetRepository";
export class ListVideoAssets {
  constructor(private repo: VideoAssetRepository) {}
  async execute(userId: string) {
    return this.repo.findAllByUser(userId);
  }
}