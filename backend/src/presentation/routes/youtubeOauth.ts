import { Router, Request, Response } from "express";
import axios from "axios";
import { generateYoutubeOauthState } from "../../utils/youtubeOauthState";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { verifyYoutubeOauthState } from "../../utils/youtubeOauthState";
import { StreamAccountRepositoryPrisma } from "../../infrastructure/db/StreamAccountRepositoryPrisma";
import { AddSteamAccount } from "../../app/usecases/streamAccount/AddAccount";
import { Logger } from "../../utils/logger";
import * as dotenv from "dotenv";
dotenv.config();

const router = Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

router.get("/youtube", authMiddleware, (req: AuthRequest, res: Response) => {
  // User yang login
  const userId = req.userId!;
  const state = generateYoutubeOauthState(userId);

  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.force-ssl"
  ].join(" ");

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}&access_type=offline&prompt=consent`;

  res.json({ url });
});

router.get("/youtube/callback", async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.status(400).send("Missing code or state.");

    // Ambil userId dari state (JWT)
    const { userId } = verifyYoutubeOauthState(state as string);

    // Tukar code dengan token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code: code as string,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // Ambil info channel YouTube
    const channelRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const channel = channelRes.data.items?.[0];
    const accountName = channel?.snippet?.title || "YouTube Channel";

    
    const accountRepo = new StreamAccountRepositoryPrisma();
    const addAccount = new AddSteamAccount(accountRepo);
    const expiredAt = new Date(Date.now() + expires_in * 1000);
    await addAccount.execute(userId, 'Youtube', accountName, access_token, refresh_token, expiredAt);
    // Redirect ke frontend (ganti FE_URL sesuai env atau hardcode)
    const FE_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    // Bisa tambahkan query success, dll sesuai kebutuhan
    res.redirect(`${FE_URL}/oauth/success?provider=youtube`);
  } catch (e: any) {
    Logger.error(`OAuth process failed: ${e.message}`);
    res.status(500).send("OAuth process failed: " + e.message);
  }
});

export default router;