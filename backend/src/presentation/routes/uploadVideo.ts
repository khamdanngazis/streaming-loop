import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { VideoAssetRepositoryPrisma } from "../../infrastructure/db/VideoAssetRepositoryPrisma";
import { UploadVideoAsset } from "../../app/usecases/videoAsset/UploadVideoAsset";
import { Logger } from "../../utils/logger";

const router = Router();
router.use(authMiddleware);

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { url, filename, size, mimetype, originalName } = req.body;
    const videoRepo = new VideoAssetRepositoryPrisma();
    const uploadUsecase = new UploadVideoAsset(videoRepo);

    const asset = await uploadUsecase.execute({
      userId: req.userId!,
      filename,
      path: url, 
      size: size,
      mimetype: mimetype,
      originalName: originalName,
    });

    res.status(201).json({
      id: asset.id,
      filename: asset.filename,
      path: asset.path,
      size: asset.size,
      mimetype: asset.mimetype,
      originalName: asset.originalName,
      createdAt: asset.createdAt,
      cdnUrl: url,
    });
  } catch (e: any) {
    Logger.error(`Failed to add video: ${e.message}`);
    res.status(500).json({ error: "Failed to add video asset" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const videoId = req.params.id;
    const videoRepo = new VideoAssetRepositoryPrisma();
    await videoRepo.softDelete(videoId);
    res.json({ message: "Video asset deleted" });
  } catch (e: any) {
    Logger.error(`Failed to delete video asset: ${e.message}`);
    res.status(500).json({ error: "Failed to delete video asset" });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  try {
    const videoRepo = new VideoAssetRepositoryPrisma();
    const assets = await videoRepo.findAllByUser(req.userId!);
    res.json(assets);
  } catch (e: any) {
    Logger.error(`Failed to list video assets: ${e.message}`);
    res.status(500).json({ error: "Failed to list video assets" });
  }
});

export default router;