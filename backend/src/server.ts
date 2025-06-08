import express from "express";
import userRoutes from "./presentation/routes/user";
import streamingAccountRouter from "./presentation/routes/streamingAccount";
import youtubeOauthRouter from "./presentation/routes/youtubeOauth";
import UploadVideoRouter from "./presentation/routes/uploadVideo";
import streamRouter from "./presentation/routes/stream";
import cors from "cors";

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cors()); // Enable CORS for all routes    

  // Register routes here
  app.use("/api/user", userRoutes);

// Streaming account routes
  app.use("/api/streaming-account", streamingAccountRouter);
    // YouTube OAuth routes
  app.use("/auth", youtubeOauthRouter);

    // Video upload routes
   app.use("/api/video", UploadVideoRouter);

   // Stream management routes
  app.use("/api/stream", streamRouter);

  // Health check
  app.get("/health", (req, res) => res.send("OK"));

  return app;
}