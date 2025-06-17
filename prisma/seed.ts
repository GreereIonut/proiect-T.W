import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Default categories
  const defaultCategories = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Biography',
    'History',
    'Science',
    'Technology'
  ]

  console.log('Seeding default categories...')
  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log('Default categories seeded!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
