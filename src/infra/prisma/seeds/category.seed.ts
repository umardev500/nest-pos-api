import { PrismaClient } from 'prisma/generated';

const prisma = new PrismaClient();

export default async function seedCategories() {
  console.log('🌟 Seeding categories...');

  // Seed categories
  await prisma.category.createMany({
    data: [
      { name: 'Clothing', description: 'All clothing items' },
      { name: 'Electronics', description: 'All electronic devices' },
      { name: 'Home Decor', description: 'Decorative items for the home' },
      { name: 'Books', description: 'Books for reading' },
      { name: 'Toys', description: 'Fun toys for kids' },
    ],
  });
}
