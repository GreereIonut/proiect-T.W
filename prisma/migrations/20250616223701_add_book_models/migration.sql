/*
  Warnings:

  - You are about to drop the column `publishedDate` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `commentsCount` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `ReadingListItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReadingListItem" DROP CONSTRAINT "ReadingListItem_bookId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingListItem" DROP CONSTRAINT "ReadingListItem_userId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "publishedDate",
ADD COLUMN     "published" TIMESTAMP(3),
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "commentsCount",
DROP COLUMN "likes",
ALTER COLUMN "rating" SET DEFAULT 0;

-- DropTable
DROP TABLE "ReadingListItem";

-- CreateTable
CREATE TABLE "ReadingList" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TO_READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "ReadingList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingList_userId_bookId_key" ON "ReadingList"("userId", "bookId");

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
