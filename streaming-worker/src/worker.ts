import { Worker, Queue, Job } from "bullmq";
import { config } from "./config";
import { Streamer, StreamJob, StopJob } from "./streamer";
import { Logger } from "./logger";
import IORedis from "ioredis";

// Set up Redis connection
const connection = new IORedis(config.redis);

const streamer = new Streamer();

const streamingWorker = new Worker<StreamJob>(
  config.queueName,
  async (job: Job<StreamJob>) => {
    try {
      Logger.info(`Received streaming job: ${JSON.stringify(job.data)}`);
      await streamer.start({
        videoPath: job.data.videoPath,
        rtmpUrl: job.data.rtmpUrl,
        loop: job.data.loop ?? true,
        jobId: job.data.jobId,
      });
      Logger.info("Streaming job finished.");
    } catch (err) {
      Logger.error("Streaming job failed: " + err);
      throw err;
    }
  },
  { connection, concurrency: Number(process.env.MAX_JOB_HANDLE) || 100 }
);

const stopWorker = new Worker<StopJob>(
  config.stopQueueName,
  async (job: Job<StopJob>) => {
    try {
      Logger.info(`Received stop job for streaming job: ${job.data.targetJobId}`);
      streamer.stop(job.data.targetJobId);
      Logger.info(`Streaming job ${job.data.targetJobId} stopped.`);
    } catch (err) {
      Logger.error(`Stop job failed: ${err}`);
      throw err;
    }
  },
  { connection }
);


streamingWorker.on("completed", (job) => {
  Logger.info(`Streaming job ${job.id} completed.`);
});
streamingWorker.on("failed", (job, err) => {
  Logger.error(`Streaming job ${job?.id} failed: ${err}`);
});
stopWorker.on("completed", (job) => {
  Logger.info(`Stop job ${job.id} completed.`);
});
stopWorker.on("failed", (job, err) => {
  Logger.error(`Stop job ${job?.id} failed: ${err}`);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  Logger.info("Graceful shutdown...");
  await streamingWorker.close();
  await stopWorker.close();
  process.exit(0);
});