import { StreamAccount } from "../entities/StreamAccount";
export interface StreamAccountRepository {
  create(account: Omit<StreamAccount, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<StreamAccount>;
  findAllByUser(userId: string): Promise<StreamAccount[]>;
  findById(id: string): Promise<StreamAccount | null>;
  softDelete(id: string): Promise<void>;
  findByProviderAndName(userId: string, provider: string, accountName: string): Promise<StreamAccount | null>;
}