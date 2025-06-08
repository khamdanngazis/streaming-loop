/*
  Warnings:

  - Made the column `refreshToken` on table `StreamAccount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expiresAt` on table `StreamAccount` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StreamAccount" ALTER COLUMN "refreshToken" SET NOT NULL,
ALTER COLUMN "expiresAt" SET NOT NULL;
