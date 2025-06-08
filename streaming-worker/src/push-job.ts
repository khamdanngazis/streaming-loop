import { Queue } from "bullmq";
import { config } from "./config";
import IORedis from "ioredis";
import * as dotenv from "dotenv";
dotenv.config();

const connection = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  maxRetriesPerRequest: null,
});
const queue = new Queue(config.queueName, { connection });

async function main() {
  await queue.add("stream", {
    videoPath: "./videos/sample_video.mp4",
    rtmpUrl: "rtmp://localhost:1935/live/8vsx-2f51-xthu-7dbg-2apf",
    loop: true,
  });
  console.log("Job pushed! Worker akan otomatis mulai stream.");
  process.exit(0);
}

main();