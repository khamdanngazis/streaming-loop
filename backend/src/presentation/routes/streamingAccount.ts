import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { StreamAccountRepositoryPrisma } from "../../infrastructure/db/StreamAccountRepositoryPrisma";
import { AddSteamAccount } from "../../app/usecases/streamAccount/AddAccount";
import { ListStreamAccounts } from "../../app/usecases/streamAccount/ListAccounts";
import { DeleteStreamAccount } from "../../app/usecases/streamAccount/DeleteAccount";
import { Logger } from "../../utils/logger";

const repo = new StreamAccountRepositoryPrisma();
const addAccount = new AddSteamAccount(repo);
const listAccounts = new ListStreamAccounts(repo);
const deleteAccount = new DeleteStreamAccount(repo);

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const accounts = await listAccounts.execute(userId);
  res.json(accounts);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const accountId = req.params.id;
    await deleteAccount.execute(accountId);
    res.json({ message: "Account deleted" });
  } catch (e: any) {
    Logger.error(`Failed to deleted account:  ${e.message}`);
    res.status(400).json({ error: "Failed to deleted account" });
  }
});

export default router;