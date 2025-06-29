// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { username: username },
    update: {
      // You can update fields here if needed
      password: password,
    },
    create: {
      username: username,
      password: password,
    },
  });

  console.log(`Successfully upserted admin user: ${user.username}`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });