import { Queue } from "bullmq";
import IORedis from "ioredis";
import { config } from "../../config/config";
import * as dotenv from "dotenv";
dotenv.config();

const connection = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  maxRetriesPerRequest: null,
});

export const streamQueue = new Queue(config.queueName, { connection });