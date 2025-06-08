import { StreamRepository } from "../../../domain/interfaces/StreamRepository";
export class ListStream {
  constructor(private repo: StreamRepository) {}
  async execute(userId: string) {
    return this.repo.findAllByUser(userId);
  }
}