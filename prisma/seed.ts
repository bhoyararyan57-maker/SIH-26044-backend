import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: {
      email: 'alex@university.edu',
    },
    update: {
      password: passwordHash,
      role: Role.STUDENT,
    },
    create: {
      email: 'alex@university.edu',
      password: passwordHash,
      role: Role.STUDENT,
    },
  });

  console.log('Test user created or updated:');
  console.log(user.email);
  console.log('Password: password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });