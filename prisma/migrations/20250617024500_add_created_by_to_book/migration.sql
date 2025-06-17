-- AlterTable: Add createdById to Book and create relation to User
ALTER TABLE "Book" ADD COLUMN "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update existing books to have a default creator if needed
-- You may want to adjust this based on your needs
UPDATE "Book" SET "createdById" = (SELECT id FROM "User" LIMIT 1) WHERE "createdById" IS NULL;
