import { streamQueue } from "../../../infrastructure/queue/streamQue";

interface ScheduleStreamJobInput {
  videoPath: string;
  rtmpUrl: string;
  loop?: boolean;
  schedule: Date | string;
  jobId: string
}

export class ScheduleStreamJob {
  async execute(input: ScheduleStreamJobInput) {
    const delay = Math.max(new Date(input.schedule).getTime() - Date.now(), 0);
    console.log(`Scheduling stream job for ${input.videoPath} at ${input.rtmpUrl} in ${delay}ms`);
    console.log(`Queue name: ${process.env.QUEUE_NAME || "stream-job"}`);
    await streamQueue.add(
      process.env.QUEUE_NAME || "stream-job",
      {
        videoPath: input.videoPath,
        rtmpUrl: input.rtmpUrl,
        loop: input.loop || false,
        jobId: input.jobId,
      },
      {
        delay,
      }
    );
  }
}