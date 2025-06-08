import { StreamAccountRepository } from "../../../domain/interfaces/StreamAccountRepository";
import { StreamAccount } from "../../../domain/entities/StreamAccount";

export class AddSteamAccount {
  constructor(private repo: StreamAccountRepository) {}
  async execute(userId: string, provider:string, accountName: string, accessToken: string, refreshToken: string, expiresAt: Date): Promise<StreamAccount> {
    // Cek duplicate
    const existing = await this.repo.findByProviderAndName(userId, provider, accountName);
    if (existing) throw new Error("Account already exists.");
    return this.repo.create({ userId, provider, accountName, accessToken, refreshToken, expiresAt });
  }
}