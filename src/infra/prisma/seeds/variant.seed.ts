// prisma/seed/variant.seed.ts

import { PrismaClient } from 'prisma/generated';

const prisma = new PrismaClient();

export default async function seedVariants() {
  console.log('🌈 Seeding variant groups and options...');

  // Seed variant groups
  await prisma.variantGroup.create({
    data: {
      name: 'Size',
      ProductVariantOption: {
        create: [
          { value: 'S' },
          { value: 'M' },
          { value: 'L' },
          { value: 'XL' },
          { value: 'XXL' },
        ],
      },
    },
  });

  await prisma.variantGroup.create({
    data: {
      name: 'Color',
      ProductVariantOption: {
        create: [
          { value: 'Red' },
          { value: 'Blue' },
          { value: 'Green' },
          { value: 'Yellow' },
          { value: 'Orange' },
          { value: 'Purple' },
          { value: 'Pink' },
        ],
      },
    },
  });

  console.log('✅ Variant groups and options seeded.');
}
