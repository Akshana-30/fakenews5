-- DropForeignKey
ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_user_id_fkey";

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_info"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
