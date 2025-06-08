import { PrismaClient, Stream as PrismaStream } from "@prisma/client";
import { Stream } from "../../domain/entities/Stream";
import { StreamRepository } from "../../domain/interfaces/StreamRepository";

const prisma = new PrismaClient();

function toEntity(prismaStream: PrismaStream): Stream {
  return {
    id: prismaStream.id,
    accountId: prismaStream.accountId,
    broadcastId: prismaStream.broadcastId,
    title: prismaStream.title,
    description: prismaStream.description,
    source: prismaStream.source,
    schedule: prismaStream.schedule,
    status: prismaStream.status,
    rtmpUrl: prismaStream.rtmpUrl,
    watchingUrl: prismaStream.watchingUrl,
    streamKey: prismaStream.streamKey,
    privacy: prismaStream.privacy ?? undefined,
    createdAt: prismaStream.createdAt,
    updatedAt: prismaStream.updatedAt,
    deletedAt: prismaStream.deletedAt ?? undefined,
  };
}

export class StreamRepositoryPrisma implements StreamRepository {
  async create(data: Omit<Stream, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<Stream> {
    const created = await prisma.stream.create({ data });
    return toEntity(created);
  }

  async findAllByUser(userId: string): Promise<Stream[]> {
    // Join with StreamAccount to filter by userId
    const streams = await prisma.stream.findMany({
      where: {
        account: {
          userId: userId,
        },
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });
    return streams.map(toEntity);
  }

  async findById(id: string): Promise<Stream | null> {
    const found = await prisma.stream.findUnique({ where: { id } });
    return found && !found.deletedAt ? toEntity(found) : null;
  }

  async softDelete(id: string): Promise<void> {
    await prisma.stream.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
  async updateStatus(id: string, status: "stopped" | "running"): Promise<Stream> {
    const updated = await prisma.stream.update({
      where: { id },
      data: { status },
    });
    return toEntity(updated);
  }
}