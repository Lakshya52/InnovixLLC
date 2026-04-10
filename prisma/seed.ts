import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({})

async function main() {
  const adminEmail = 'admin@gmail.com'
  const adminPassword = await bcrypt.hash('Password@123', 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Super Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log({ admin })
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
