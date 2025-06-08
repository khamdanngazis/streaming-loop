import { Router } from "express";
import { RegisterUser } from "../../app/usecases/RegisterUser";
import { LoginUser } from "../../app/usecases/LoginUser";
import { UserRepositoryPrisma } from "../../infrastructure/db/UserRepositoryPrisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Logger } from "../../utils/logger";

const userRepo = new UserRepositoryPrisma();
const registerUser = new RegisterUser(userRepo);
const loginUser = new LoginUser(userRepo);

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser.execute(email, password);
    res.json(result);
  } catch (e: any) {
    Logger.error(`Login failed: ${e.message}`);
    res.status(401).json({ error: e.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser.execute(email, password, name);
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (e: any) {
    Logger.error(`Registration failed: ${e.message}`);
    res.status(400).json({ error: e.message });
  }
});

router.delete("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    await userRepo.softDelete(req.userId!);
    res.json({ message: "User soft deleted." });
  } catch (e: any) {
    Logger.error(`Failed to delete user: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  const user = await userRepo.findById(req.userId!);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { passwordHash, ...userSafe } = user;
  res.json(userSafe);
});

export default router;