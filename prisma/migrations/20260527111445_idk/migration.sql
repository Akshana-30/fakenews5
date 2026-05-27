-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UNSUBSCRIBED', 'SUBSCRIBER', 'AUTHOR', 'EDITOR', 'ADMIN');

-- CreateTable
CREATE TABLE "article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmark" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "articleId" TEXT,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "author" (
    "id" TEXT NOT NULL,
    "alias" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_info" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'UNSUBSCRIBED',

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "user_info_id" TEXT NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArticleToAuthor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToAuthor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "author_user_id_key" ON "author"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_info_user_id_key" ON "user_info"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_user_info_id_key" ON "subscription"("user_info_id");

-- CreateIndex
CREATE INDEX "_ArticleToCategory_B_index" ON "_ArticleToCategory"("B");

-- CreateIndex
CREATE INDEX "_ArticleToAuthor_B_index" ON "_ArticleToAuthor"("B");

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "author" ADD CONSTRAINT "author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_info_id_fkey" FOREIGN KEY ("user_info_id") REFERENCES "user_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToCategory" ADD CONSTRAINT "_ArticleToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToCategory" ADD CONSTRAINT "_ArticleToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToAuthor" ADD CONSTRAINT "_ArticleToAuthor_A_fkey" FOREIGN KEY ("A") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToAuthor" ADD CONSTRAINT "_ArticleToAuthor_B_fkey" FOREIGN KEY ("B") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
