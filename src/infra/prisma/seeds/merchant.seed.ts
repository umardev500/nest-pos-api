import { PrismaClient } from 'prisma/generated';

const prisma = new PrismaClient();

export default async function seedMerchant() {
  console.log('🌟 Seeding merchants...');

  // Seeding merchants
  const merchants = [
    {
      name: 'Merchant 1',
      address: '123 Merchant Street, Cityville',
      photo: 'https://via.placeholder.com/150',
      phone: '+123456789',
    },
    {
      name: 'Merchant 2',
      address: '456 Vendor Road, Townsville',
      photo: 'https://via.placeholder.com/150',
      phone: '+987654321',
    },
    {
      name: 'Merchant 3',
      address: '789 Business Blvd, Business City',
      photo: 'https://via.placeholder.com/150',
      phone: '+1122334455',
    },
  ];

  // Create the merchants in the database
  for (const merchant of merchants) {
    await prisma.merchant.create({
      data: merchant,
    });
  }

  console.log('Seeding completed!');
}
