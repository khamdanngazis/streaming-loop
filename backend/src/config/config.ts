import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
  },
  queueName: process.env.QUEUE_NAME || "streaming-jobs",
  stopQueueName: process.env.STOP_QUEUE_NAME || "stop-streaming-jobs",
  ffmpegPath: process.env.FFMPEG_PATH || "ffmpeg",
};