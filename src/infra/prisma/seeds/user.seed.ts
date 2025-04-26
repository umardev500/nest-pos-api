import * as bcrypt from 'bcrypt';
import { PrismaClient } from 'prisma/generated';

const prisma = new PrismaClient();

export default async function seedUser() {
  console.log('🌟 Seeding users...');

  const users = [
    {
      fullname: 'John Doe',
      email: 'admin@gmail.com',
      password: 'admin', // Plain text password
      merchant_id: 1,
    },
  ];

  // Loop through each user and hash the password before creating
  for (const user of users) {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the salt rounds

    // Create the user with the hashed password
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword, // Save the hashed password
      },
    });
  }

  console.log('✅ Seeding complete!');
}
