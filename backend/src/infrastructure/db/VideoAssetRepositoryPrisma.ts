import { prisma } from "./prisma";
import { VideoAssetRepository } from "../../domain/interfaces/VideoAssetRepository";
import { VideoAsset } from "../../domain/entities/VideoAsset";

export class VideoAssetRepositoryPrisma implements VideoAssetRepository {
    async create(data: Omit<VideoAsset, "id" | "createdAt" | "updatedAt">): Promise<VideoAsset> {
        return prisma.videoAsset.create({ data });
    }

    async findById(id: string): Promise<VideoAsset | null> {
        return prisma.videoAsset.findFirst({ where: { id, deletedAt: null } });
    }

    async softDelete(id: string): Promise<void> {
        await prisma.videoAsset.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    
    async findAllByUser(userId: string): Promise<VideoAsset[]> {
        return prisma.videoAsset.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: "desc" }
        });
    }
}