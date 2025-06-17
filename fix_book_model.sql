-- Fix the Book model
ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS "createdById" INTEGER REFERENCES "User"(id);
