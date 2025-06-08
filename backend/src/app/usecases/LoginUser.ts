import { UserRepository } from "../../domain/interfaces/UserRepository";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../domain/entities/User";

export class LoginUser {
  constructor(private userRepo: UserRepository) {}
  async execute(email: string, password: string): Promise<{ token: string; user: Omit<User, "passwordHash"> }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    // Remove passwordHash before returning
    const { passwordHash, ...userSafe } = user;
    return { token, user: userSafe };
  }
}