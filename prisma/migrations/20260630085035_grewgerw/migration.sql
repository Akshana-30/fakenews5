/*
  Warnings:

  - A unique constraint covering the columns `[newsletterId]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `newsletterId` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "author" ADD COLUMN     "newsletterSettingsId" TEXT;

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "newsletterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "NewsletterSettings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "NewsletterSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToNewsletterSettings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToNewsletterSettings_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSettings_user_id_key" ON "NewsletterSettings"("user_id");

-- CreateIndex
CREATE INDEX "_CategoryToNewsletterSettings_B_index" ON "_CategoryToNewsletterSettings"("B");

-- CreateIndex
CREATE UNIQUE INDEX "category_newsletterId_key" ON "category"("newsletterId");

-- AddForeignKey
ALTER TABLE "author" ADD CONSTRAINT "author_newsletterSettingsId_fkey" FOREIGN KEY ("newsletterSettingsId") REFERENCES "NewsletterSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNewsletterSettings" ADD CONSTRAINT "_CategoryToNewsletterSettings_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNewsletterSettings" ADD CONSTRAINT "_CategoryToNewsletterSettings_B_fkey" FOREIGN KEY ("B") REFERENCES "NewsletterSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
