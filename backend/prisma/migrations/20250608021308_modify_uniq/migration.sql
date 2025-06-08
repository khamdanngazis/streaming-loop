/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider,accountName,deletedAt]` on the table `StreamAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,deletedAt]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[filename,userId,deletedAt]` on the table `VideoAsset` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StreamAccount_userId_provider_accountName_key";

-- CreateIndex
CREATE UNIQUE INDEX "StreamAccount_userId_provider_accountName_deletedAt_key" ON "StreamAccount"("userId", "provider", "accountName", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_deletedAt_key" ON "User"("email", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "VideoAsset_filename_userId_deletedAt_key" ON "VideoAsset"("filename", "userId", "deletedAt");
