/*
  Warnings:

  - You are about to drop the column `channelId` on the `Stream` table. All the data in the column will be lost.
  - Added the required column `description` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamKey` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamURL` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Made the column `rtmpUrl` on table `Stream` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "channelId",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "streamKey" TEXT NOT NULL,
ADD COLUMN     "streamURL" TEXT NOT NULL,
ALTER COLUMN "rtmpUrl" SET NOT NULL;
