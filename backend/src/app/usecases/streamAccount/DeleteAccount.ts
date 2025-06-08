import { StreamAccountRepository } from "../../../domain/interfaces/StreamAccountRepository";
export class DeleteStreamAccount {
  constructor(private repo: StreamAccountRepository) {}
  async execute(accountId: string) {
    return this.repo.softDelete(accountId);
  }
}