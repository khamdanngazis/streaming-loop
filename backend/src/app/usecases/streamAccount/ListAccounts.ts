import { StreamAccountRepository } from "../../../domain/interfaces/StreamAccountRepository";
export class ListStreamAccounts {
  constructor(private repo: StreamAccountRepository) {}
  async execute(userId: string) {
    return this.repo.findAllByUser(userId);
  }
}