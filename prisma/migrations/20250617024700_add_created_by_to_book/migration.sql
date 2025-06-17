-- Add createdById to Book table
ALTER TABLE "Book" ADD COLUMN "createdById" INTEGER;

-- Add foreign key constraint for createdById
ALTER TABLE "Book" ADD CONSTRAINT "Book_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
