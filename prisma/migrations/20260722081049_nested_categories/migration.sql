/*
  Warnings:

  - You are about to drop the `_ArticleToSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArticleToSubCategory" DROP CONSTRAINT "_ArticleToSubCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToSubCategory" DROP CONSTRAINT "_ArticleToSubCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "sub_category" DROP CONSTRAINT "sub_category_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "parentId" TEXT;

-- DropTable
DROP TABLE "_ArticleToSubCategory";

-- DropTable
DROP TABLE "sub_category";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
