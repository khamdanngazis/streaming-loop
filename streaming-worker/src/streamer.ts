import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { config } from "./config";
import { Logger } from "./logger";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import { URL } from "url";

export interface StreamJob {
  videoPath: string;
  rtmpUrl: string;
  loop?: boolean;
  jobId: string;
}

export interface StopJob {
  targetJobId: string;
}

export class Streamer {
  private processes = new Map<string, { ffmpeg: ChildProcessWithoutNullStreams, stopped: boolean }>();

  public async start(job: StreamJob): Promise<void> {
    
    if( !job.videoPath || !job.rtmpUrl || !job.jobId) {
      Logger.error("Invalid job data. videoPath, rtmpUrl, and jobId are required.");
      return;
    }

    if (this.processes.has(job.jobId)) {
      Logger.error(`Job with ID ${job.jobId} is already running.`);
      return;
    }

    this.processes.set(job.jobId, { ffmpeg: null as any, stopped: false });
    while (!this.processes.get(job.jobId)?.stopped) {
      let inputPath = job.videoPath;
      let tempFile = "";

      if (this.isHttpUrl(job.videoPath)) {
        Logger.info(`Video source is a URL: ${job.videoPath}`);
        // Download the file to a temp file
        tempFile = await this.downloadToTempFile(job.videoPath);
        if (!tempFile) {
          Logger.error(`Failed to download video from URL: ${job.videoPath}`);
          await this.delay(5000);
          continue;
        }
        inputPath = tempFile;
      } else {
        if (!fs.existsSync(job.videoPath)) {
          Logger.error(`File not found: ${job.videoPath}`);
          await this.delay(5000);
          continue;
        }
      }

      Logger.info(`Starting stream with video: ${inputPath} to ${job.rtmpUrl}`);

      const args = [
        "-re",
        ...(job.loop ? ["-stream_loop", "-1"] : []),
        "-i", inputPath,
        "-c:v", "copy",
        "-c:a", "aac",
        "-f", "flv",
        job.rtmpUrl
      ];

      const ffmpeg = spawn("ffmpeg", args);
      ffmpeg.stdout.on("data", (data) => Logger.info(`ffmpeg: ${data}`));
      ffmpeg.on("close", (code) => Logger.info(`ffmpeg exited with code: ${code}`));
      await new Promise<void>((resolve) => {
        ffmpeg.on("exit", () => resolve());
      });
      if (!this.processes.get(job.jobId)?.stopped) {
        Logger.error("ffmpeg stopped unexpectedly. Restarting in 5 seconds...");
        await this.delay(5000);
      }
    }
    this.processes.delete(job.jobId);
  }

  public stop(jobId: string): void {
    const proc = this.processes.get(jobId);
    if (proc) {
      proc.stopped = true;
      proc.ffmpeg?.kill("SIGINT");
      this.processes.delete(jobId);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isHttpUrl(pathOrUrl: string): boolean {
    return /^https?:\/\//i.test(pathOrUrl);
  }

  private async downloadToTempFile(fileUrl: string): Promise<string> {
    try {
      const urlObj = new URL(fileUrl);
      const ext = path.extname(urlObj.pathname) || ".mp4";
      const tempFile = path.join(
        "/tmp",
        `cdn-download-${Date.now()}${Math.random().toString(36).substring(2)}${ext}`
      );
      const file = fs.createWriteStream(tempFile);

      const httpModule = urlObj.protocol === "https:" ? https : http;

      await new Promise<void>((resolve, reject) => {
        httpModule.get(fileUrl, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download file: HTTP ${response.statusCode}`));
            return;
          }
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        }).on("error", (err) => {
          fs.unlink(tempFile, () => {});
          reject(err);
        });
      });

      return tempFile;
    } catch (err) {
      Logger.error(`Error downloading temp file: ${(err as Error).message}`);
      return "";
    }
  }
}