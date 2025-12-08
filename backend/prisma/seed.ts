import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || '12345678';

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (!userExists) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        email,
        name: 'Admin GDASH',
        password: hashedPassword,
      },
    });
    console.log(`✅ Usuário Admin criado: ${email}`);
  } else {
    console.log('ℹ️ Usuário Admin já existe.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
