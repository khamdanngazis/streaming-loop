import { config } from "../../../config/config";
import { streamQueue } from "../../../infrastructure/queue/streamQue";

export class StopStreamJob {
  async execute(jobId: string) {
    await streamQueue.add(
      config.stopQueueName,
      {
        jobId: jobId,
      }
    );
  }
}