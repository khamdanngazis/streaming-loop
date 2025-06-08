/*
  Warnings:

  - You are about to drop the column `streamURL` on the `Stream` table. All the data in the column will be lost.
  - Added the required column `broadcastId` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wachingUrl` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "streamURL",
ADD COLUMN     "broadcastId" TEXT NOT NULL,
ADD COLUMN     "wachingUrl" TEXT NOT NULL;
