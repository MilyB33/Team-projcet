import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const type = ['standard', 'employer'];

// initialize the Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  // create two dummy users
  const passwordSabin = await bcrypt.hash('password-sabin', roundsOfHashing);
  const passwordAlex = await bcrypt.hash('password-alex', roundsOfHashing);

  const type1 = await prisma.accountType.create({
    data: {
      name: type[0],
    },
  });

  const type2 = await prisma.accountType.create({
    data: {
      name: type[1],
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'sabin@adams.com' },
    update: {
      password: passwordSabin,
    },
    create: {
      email: 'sabin@adams.com',
      first_name: 'Sabin',
      last_name: 'Adams',
      password: passwordSabin,
      typeId: type1.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'alex@ruheni.com' },
    update: {
      password: passwordAlex,
    },
    create: {
      email: 'alex@ruheni.com',
      first_name: 'Alex',
      last_name: 'Ruheni',
      company: 'test',
      password: passwordAlex,
      typeId: type2.id,
    },
  });

  console.log({ user1, user2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
