import { StreamAccount } from "../../domain/entities/StreamAccount";
import { StreamAccountRepository } from "../../domain/interfaces/StreamAccountRepository";
import { prisma } from "./prisma";



export class StreamAccountRepositoryPrisma implements StreamAccountRepository {
  async create(account: Omit<StreamAccount, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<StreamAccount> {
    return prisma.streamAccount.create({ data: { ...account } });
  }
  async findAllByUser(userId: string): Promise<StreamAccount[]> {
    return prisma.streamAccount.findMany({
      where: { userId, deletedAt: null }
    });
  }
  async findById(id: string): Promise<StreamAccount | null> {
    return prisma.streamAccount.findFirst({ where: { id, deletedAt: null } });
  }
  async softDelete(id: string): Promise<void> {
    await prisma.streamAccount.update({ where: { id }, data: { deletedAt: new Date() } });
  }
  async findByProviderAndName(userId: string, provider: string, accountName: string): Promise<StreamAccount | null> {
    return prisma.streamAccount.findFirst({
      where: { userId, provider, accountName, deletedAt: null }
    });
  }
  
}