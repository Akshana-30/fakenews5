/*
  Warnings:

  - You are about to drop the `subscription` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[alias]` on the table `author` will be added. If there are existing duplicate values, this will fail.
  - Made the column `alias` on table `author` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_user_info_id_fkey";

-- AlterTable
ALTER TABLE "account" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "author" ALTER COLUMN "alias" SET NOT NULL;

-- DropTable
DROP TABLE "subscription";

-- CreateIndex
CREATE UNIQUE INDEX "author_alias_key" ON "author"("alias");
