/*
  Warnings:

  - Made the column `articleId` on table `bookmark` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_articleId_fkey";

-- AlterTable
ALTER TABLE "bookmark" ALTER COLUMN "articleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
