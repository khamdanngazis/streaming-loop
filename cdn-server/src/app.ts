import express from "express";
import uploadRouter from "./routes/upload";
import { errorHandler } from "./middleware/errorHandler";
import { CDN_PORT, UPLOAD_DIR } from "./config";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/videos", express.static(UPLOAD_DIR, {
  maxAge: "7d",
  setHeaders(res) {
    res.setHeader("Content-Disposition", "inline");
  }
}));

app.use("/", uploadRouter);

app.get("/health", (_req, res) => res.send("OK"));

app.use(errorHandler);

app.listen(CDN_PORT, () => {
  console.log(`CDN server running at http://localhost:${CDN_PORT}`);
});