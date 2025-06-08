import { StreamAccountRepository } from "../../../domain/interfaces/StreamAccountRepository";
import { StreamRepository } from "../../../domain/interfaces/StreamRepository";
import { YouTubeInfrastructure } from "../../../infrastructure/youtube/youtubeInfrastructure";
import { StopStreamJob } from "./StopStreamJob";

export class StopStream {
   constructor(
      private readonly streamRepo: StreamRepository,
      private readonly streamAccountRepo: StreamAccountRepository,
    ) {}

  async execute(streamId: string): Promise<{ message: string }> {

    if (!streamId) {
      throw new Error("Stream ID is required");
    }

    const stream = await this.streamRepo.findById(streamId);

    if (!stream) {
      throw new Error("Stream not found");
    }

    if (stream.status === "stopped") {
      throw new Error("Stream is already stopped");
    }

    const streamAccount = await this.streamAccountRepo.findById(stream.accountId);
    if (!streamAccount) throw new Error("Stream account not found");

    const yt = new YouTubeInfrastructure({
        access_token: streamAccount.accessToken, 
        refresh_token: streamAccount.refreshToken , 
        expiry_date: streamAccount.expiresAt.getTime()
    });

    await yt.stopBroadcast(stream.broadcastId);

    const stopJob = new StopStreamJob(); 
    await stopJob.execute(stream.id);

    await this.streamRepo.updateStatus(stream.id, "stopped");

    return { message: "Stream stopped successfully" };
  }
}