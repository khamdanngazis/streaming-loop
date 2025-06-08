/*
  Warnings:

  - You are about to drop the column `wachingUrl` on the `Stream` table. All the data in the column will be lost.
  - Added the required column `watchingUrl` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "wachingUrl",
ADD COLUMN     "loop" BOOLEAN,
ADD COLUMN     "watchingUrl" TEXT NOT NULL;
