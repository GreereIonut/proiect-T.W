/*
  Warnings:

  - You are about to drop the column `currentPage` on the `ReadingList` table. All the data in the column will be lost.
  - You are about to drop the column `finishedAt` on the `ReadingList` table. All the data in the column will be lost.
  - You are about to drop the column `readingStatus` on the `ReadingList` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `ReadingList` table. All the data in the column will be lost.
  - You are about to drop the column `totalPages` on the `ReadingList` table. All the data in the column will be lost.
  - You are about to drop the `Shelf` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookToShelf` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shelf" DROP CONSTRAINT "Shelf_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BookToShelf" DROP CONSTRAINT "_BookToShelf_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToShelf" DROP CONSTRAINT "_BookToShelf_B_fkey";

-- AlterTable
ALTER TABLE "ReadingList" DROP COLUMN "currentPage",
DROP COLUMN "finishedAt",
DROP COLUMN "readingStatus",
DROP COLUMN "startedAt",
DROP COLUMN "totalPages";

-- DropTable
DROP TABLE "Shelf";

-- DropTable
DROP TABLE "_BookToShelf";

-- DropEnum
DROP TYPE "ReadingStatus";
