/*
  Warnings:

  - You are about to drop the `ArticleView` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleView" DROP CONSTRAINT "ArticleView_articleId_fkey";

-- AlterTable
ALTER TABLE "article" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "ArticleView";
