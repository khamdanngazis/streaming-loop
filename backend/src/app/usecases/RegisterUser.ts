import { UserRepository } from "../../domain/interfaces/UserRepository";
import { User } from "../../domain/entities/User";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export class RegisterUser {
  constructor(private userRepo: UserRepository) {}
  async execute(email: string, password: string, name?: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("User already exists");
    const hash = await bcrypt.hash(password, 10);
    const user: User = {
      id: uuidv4(),
      email,
      passwordHash: hash,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };
    return this.userRepo.create(user);
  }
}