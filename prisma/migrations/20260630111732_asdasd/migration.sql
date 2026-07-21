/*
  Warnings:

  - You are about to drop the column `newsletterSettingsId` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `newsletterId` on the `category` table. All the data in the column will be lost.
  - Added the required column `active` to the `NewsletterSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `NewsletterSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT IF EXISTS "author_newsletterSettingsId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "category_newsletterId_key";

-- AlterTable
ALTER TABLE "NewsletterSettings" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "NewsletterSettings" ADD COLUMN IF NOT EXISTS "email" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "author" DROP COLUMN IF EXISTS "newsletterSettingsId";

-- AlterTable
ALTER TABLE "category" DROP COLUMN IF EXISTS "newsletterId";

-- CreateTable
CREATE TABLE IF NOT EXISTS "_AuthorToNewsletterSettings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AuthorToNewsletterSettings_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "_AuthorToNewsletterSettings_B_index" ON "_AuthorToNewsletterSettings"("B");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "_AuthorToNewsletterSettings" ADD CONSTRAINT "_AuthorToNewsletterSettings_A_fkey" FOREIGN KEY ("A") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "_AuthorToNewsletterSettings" ADD CONSTRAINT "_AuthorToNewsletterSettings_B_fkey" FOREIGN KEY ("B") REFERENCES "NewsletterSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;