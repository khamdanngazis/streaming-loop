import { Stream } from "../entities/Stream";
export interface StreamRepository {
  create(account: Omit<Stream, "id" | "createdAt" | "updatedAt" | "deletedAt">): Promise<Stream>;
  findAllByUser(userId: string): Promise<Stream[]>;
  findById(id: string): Promise<Stream | null>;
  softDelete(id: string): Promise<void>;
  updateStatus(id: string, status: "stopped" | "running"): Promise<Stream>;
}