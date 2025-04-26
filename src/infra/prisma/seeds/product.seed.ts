// prisma/seed/product.seed.ts

import { PrismaClient } from 'prisma/generated';

const prisma = new PrismaClient();

export default async function seedProducts() {
  console.log('🌟 Seeding products with variants...');

  // Seed a product with variants
  const product = await prisma.product.create({
    data: {
      name: 'T-Shirt',
      description: 'A cool t-shirt available in various sizes and colors.',
      photo: 'https://example.com/photo.jpg',
      quantity: 100,
      ProductVariant: {
        create: [
          // Variant for Size S, Color Red
          {
            price: 2000, // Price for this variant
            quantity: 50, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 1 }, // Size S (ID = 1)
                { variantOptionId: 6 }, // Color Red (ID = 6)
              ],
            },
          },
          // Variant for Size M, Color Blue
          {
            price: 2200, // Price for this variant
            quantity: 40, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 2 }, // Size M (ID = 2)
                { variantOptionId: 7 }, // Color Blue (ID = 7)
              ],
            },
          },
          // Variant for Size L, Color Green
          {
            price: 2500, // Price for this variant
            quantity: 30, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 3 }, // Size L (ID = 3)
                { variantOptionId: 8 }, // Color Green (ID = 8)
              ],
            },
          },
          // Variant for Size XL, Color Yellow
          {
            price: 3000, // Price for this variant
            quantity: 20, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 4 }, // Size XL (ID = 4)
                { variantOptionId: 9 }, // Color Yellow (ID = 9)
              ],
            },
          },
          // Variant for Size XXL, Color Orange
          {
            price: 3500, // Price for this variant
            quantity: 10, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 5 }, // Size XXL (ID = 5)
                { variantOptionId: 10 }, // Color Orange (ID = 10)
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'T-Shirt 2',
      description: 'A cool t-shirt available in various sizes and colors.',
      photo: 'https://example.com/photo.jpg',
      quantity: 100,
      ProductVariant: {
        create: [
          // Variant for Size S, Color Red
          {
            price: 1000, // Price for this variant
            quantity: 5, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 1 }, // Size S (ID = 1)
                { variantOptionId: 6 }, // Color Red (ID = 6)
              ],
            },
          },
          // Variant for Size M, Color Blue
          {
            price: 2200, // Price for this variant
            quantity: 40, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 2 }, // Size M (ID = 2)
                { variantOptionId: 7 }, // Color Blue (ID = 7)
              ],
            },
          },
          // Variant for Size L, Color Green
          {
            price: 2500, // Price for this variant
            quantity: 30, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 3 }, // Size L (ID = 3)
                { variantOptionId: 8 }, // Color Green (ID = 8)
              ],
            },
          },
          // Variant for Size XL, Color Yellow
          {
            price: 3000, // Price for this variant
            quantity: 20, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 4 }, // Size XL (ID = 4)
                { variantOptionId: 9 }, // Color Yellow (ID = 9)
              ],
            },
          },
          // Variant for Size XXL, Color Orange
          {
            price: 3500, // Price for this variant
            quantity: 10, // Quantity for this variant
            ProductVariantOption: {
              create: [
                { variantOptionId: 5 }, // Size XXL (ID = 5)
                { variantOptionId: 10 }, // Color Orange (ID = 10)
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Product ${product.name} seeded with variants.`);
}
