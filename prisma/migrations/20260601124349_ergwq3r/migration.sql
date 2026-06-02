/*
  Warnings:

  - You are about to drop the `ArticleLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleLike" DROP CONSTRAINT "ArticleLike_article_id_fkey";

-- DropTable
DROP TABLE "ArticleLike";

-- CreateTable
CREATE TABLE "article_like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,

    CONSTRAINT "article_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "article_like_userId_key" ON "article_like"("userId");

-- AddForeignKey
ALTER TABLE "article_like" ADD CONSTRAINT "article_like_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
