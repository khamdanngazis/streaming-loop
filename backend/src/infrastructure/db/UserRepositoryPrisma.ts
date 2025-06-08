import { UserRepository } from "../../domain/interfaces/UserRepository";
import { User } from "../../domain/entities/User";
import { prisma } from "./prisma";

export class UserRepositoryPrisma implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { email, deletedAt: null } });
    return user ? { ...user } : null;
  }
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    return user ? { ...user } : null;
  }
  async create(data: Omit<User, "id" | "createdAt" | "updatedAt"> & Partial<Pick<User, "id">>): Promise<User> {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash
      },
    });
    return { ...user };
  }

  async softDelete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}