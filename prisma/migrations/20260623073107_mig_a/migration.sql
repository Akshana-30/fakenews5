/*
  Warnings:

  - You are about to drop the column `adFree` on the `plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "plan" DROP COLUMN "adFree";

-- CreateTable
CREATE TABLE "advertisement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),

    CONSTRAINT "advertisement_pkey" PRIMARY KEY ("id")
);
