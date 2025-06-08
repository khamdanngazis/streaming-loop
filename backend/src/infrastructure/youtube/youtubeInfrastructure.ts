import { google, youtube_v3 } from "googleapis";

/**
 * Infrastructure class for interacting with YouTube Live Streaming API.
 */
export class YouTubeInfrastructure {
  private youtube: youtube_v3.Youtube;
  
  constructor(private tokens: { access_token: string; refresh_token?: string; expiry_date?: number }) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });

    this.youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });
  }

  /**
   * Create a new live broadcast (scheduled or instant).
   */
  async createBroadcast(
    title: string,
    scheduledStartTime: string, // ISO8601
    description?: string,
    privacyStatus: "public" | "unlisted" | "private" = "private" // default to private
  ) {
    console.log("Creating YouTube broadcast:", scheduledStartTime)
    const res = await this.youtube.liveBroadcasts.insert({
      part: ["snippet", "status", "contentDetails"],
      requestBody: {
        snippet: {
          title,
          scheduledStartTime,
          description,
        },
        status: { privacyStatus },
        contentDetails: {
          enableAutoStart: true,
          enableAutoStop: true
        }
      },
    });
    return res.data; // contains broadcast id, etc.
  }

  /**
   * Create a new live stream.
   */
  async createStream(
    title: string,
    description: string,
  ) {
    const res = await this.youtube.liveStreams.insert({
      part: ["snippet", "cdn"],
      requestBody: {
        snippet: { title, description },
        cdn: {
          format: '1080p',
          ingestionType: 'rtmp',
          resolution: '1080p',
          frameRate: '30fps'
        }
      },
    });
    return res.data; // contains stream id, ingestion info, etc.
  }

  /**
   * Bind a stream to a broadcast.
   */
  async bindStreamToBroadcast(broadcastId: string, streamId: string) {
    const res = await this.youtube.liveBroadcasts.bind({
      id: broadcastId,
      part: ["id", "contentDetails"],
      streamId,
    });
    return res.data;
  }
  

  /**
   * Stop a broadcast (transition to complete).
   */
  async stopBroadcast(broadcastId: string) {
    const res = await this.youtube.liveBroadcasts.transition({
      id: broadcastId,
      part: ["status"],
      broadcastStatus: "complete",
    });
    return res.data;
  }
}