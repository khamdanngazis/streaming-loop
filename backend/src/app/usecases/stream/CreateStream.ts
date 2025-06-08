import { VideoAssetRepository } from "../../../domain/interfaces/VideoAssetRepository";
import { StreamAccountRepository } from "../../../domain/interfaces/StreamAccountRepository";
import { StreamRepository } from "../../../domain/interfaces/StreamRepository";
import { YouTubeInfrastructure } from "../../../infrastructure/youtube/youtubeInfrastructure";
import { ScheduleStreamJob } from "./ScheduleStreamJob";

interface CrreateStreamInput {
  videoAssetId: string;
  streamAccountId: string;
  title: string;
  description: string;
  schedule: Date | string;
  privacy?: string;
  loop?: boolean;
}

interface CreateStreamOutput {
  id: string;
  streamKey: string;
  watchingUrl: string;
}

export class CreateStream {
  constructor(
    private readonly videoAssetRepo: VideoAssetRepository,
    private readonly streamAccountRepo: StreamAccountRepository,
    private readonly streamRepo: StreamRepository
  ) {}

  async execute(input: CrreateStreamInput): Promise<CreateStreamOutput> {
    // 1. Ambil video asset
    const videoAsset = await this.videoAssetRepo.findById(input.videoAssetId);
    if (!videoAsset) throw new Error("Video asset not found");

    // 2. Ambil stream account (beserta token, dll)
    const streamAccount = await this.streamAccountRepo.findById(input.streamAccountId);
    if (!streamAccount) throw new Error("Stream account not found");

    const yt = new YouTubeInfrastructure({
        access_token: streamAccount.accessToken, 
        refresh_token: streamAccount.refreshToken , 
        expiry_date: streamAccount.expiresAt.getTime()
    });

    const startTime = new Date(input.schedule).toISOString();
    
    const ytBroadcast = await yt.createBroadcast(input.title, startTime, input.description);
    const ytStream = await yt.createStream(input.title, input.description);
    await yt.bindStreamToBroadcast(ytBroadcast.id!, ytStream.id!);

    const streamKey = ytStream.cdn?.ingestionInfo?.streamName!;
    const watchingUrl = `https://youtu.be/${ytBroadcast.id!}`
    
    const localRtmpUrl = `rtmp://localhost:1935/live/${streamKey}`;

    const stream = await this.streamRepo.create({
      accountId: input.streamAccountId,
      broadcastId: ytBroadcast.id!,
      title: input.title,
      description: input.description,
      source: videoAsset.path,
      schedule: new Date(input.schedule),
      status: "running",
      rtmpUrl: localRtmpUrl,
      watchingUrl,
      streamKey,
      privacy: input.privacy,
    });

    const scheduler = new ScheduleStreamJob();
    await scheduler.execute({
      videoPath: videoAsset.path, // CDN URL
      rtmpUrl: localRtmpUrl,
      loop: input.loop ?? false,
      schedule: input.schedule,
      jobId: stream.id,
    });

    // 7. Return info penting
    return {
      id: stream.id,
      streamKey,
      watchingUrl,
    };
  }
}