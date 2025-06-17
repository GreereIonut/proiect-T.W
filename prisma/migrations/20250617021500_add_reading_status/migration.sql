-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('WANT_TO_READ', 'READING', 'COMPLETED', 'ON_HOLD');

-- AlterTable
ALTER TABLE "ReadingList" ADD COLUMN "readingStatus" "ReadingStatus" DEFAULT 'WANT_TO_READ',
ADD COLUMN "currentPage" INTEGER,
ADD COLUMN "totalPages" INTEGER,
ADD COLUMN "startedAt" TIMESTAMP(3),
ADD COLUMN "finishedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Shelf" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shelf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookToShelf" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Shelf_userId_name_key" ON "Shelf"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToShelf_AB_unique" ON "_BookToShelf"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToShelf_B_index" ON "_BookToShelf"("B");

-- AddForeignKey
ALTER TABLE "Shelf" ADD CONSTRAINT "Shelf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToShelf" ADD CONSTRAINT "_BookToShelf_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToShelf" ADD CONSTRAINT "_BookToShelf_B_fkey" FOREIGN KEY ("B") REFERENCES "Shelf"("id") ON DELETE CASCADE ON UPDATE CASCADE;
