/*
  Warnings:

  - You are about to drop the `Plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Plans";

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "priceId" TEXT NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);
