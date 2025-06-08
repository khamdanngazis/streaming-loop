import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { CreateStream } from "../../app/usecases/stream/CreateStream";
import { StopStream } from "../../app/usecases/stream/StopStream";
import { ListStream } from "../../app/usecases/stream/ListStream";
import { VideoAssetRepositoryPrisma } from "../../infrastructure/db/VideoAssetRepositoryPrisma";
import { StreamAccountRepositoryPrisma } from "../../infrastructure/db/StreamAccountRepositoryPrisma";
import { StreamRepositoryPrisma } from "../../infrastructure/db/StreamRepositoryPrisma";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
     const streamRepo = new StreamRepositoryPrisma();
    const listStream = new ListStream(streamRepo);
    const userId = req.userId!;
      const streams = await listStream.execute(userId);
      res.json(streams);
})

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { videoAssetId, streamAccountId, title, description, schedule, privacy, loop } = req.body;
    if (!videoAssetId || !streamAccountId || !title || !description || !schedule) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Instantiate repositories
    const videoAssetRepo = new VideoAssetRepositoryPrisma();
    const streamAccountRepo = new StreamAccountRepositoryPrisma();
    const streamRepo = new StreamRepositoryPrisma();

    // Usecase
    const addStream = new CreateStream(videoAssetRepo, streamAccountRepo, streamRepo);
    const result = await addStream.execute({
      videoAssetId,
      streamAccountId,
      title,
      description,
      schedule,
      privacy,
      loop,
    });

    return res.status(201).json({
      message: "Stream created and scheduled successfully!",
      stream: result,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.delete("/:streamId/stop", async (req: AuthRequest, res) => {
  try {
    const { streamId } = req.params;
    if (!streamId) {
      return res.status(400).json({ error: "Stream ID is required" });
    }
    // Instantiate repository
    const streamRepo = new StreamRepositoryPrisma();
    const streamAccountRepo = new StreamAccountRepositoryPrisma();
    // Usecase
    const stopStream = new StopStream(streamRepo, streamAccountRepo);
    const result = await stopStream.execute(streamId);
    return res.status(200).json({
      message: result.message,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;