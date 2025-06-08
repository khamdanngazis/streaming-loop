export interface Stream {
  id: string;
  accountId: string;
  broadcastId: string;
  title: string;
  description: string;
  source: string;        // video file, playlist, etc.
  schedule: Date;
  status: string;
  rtmpUrl: string;
  watchingUrl: string;
  streamKey: string;
  privacy?: string;
  loop?: boolean;    
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}