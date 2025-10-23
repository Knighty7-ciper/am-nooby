import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'bknglabs.dev@gmail.com'
  const adminUsername = 'sensei-knighty7'
  
  console.log('Setting up admin user...')
  
  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      username: adminUsername,
      status: 'ACTIVE',
      emailVerified: true,
    },
    create: {
      id: 'admin-seed-id', // Temporary ID, will be replaced when Stack Auth user signs up
      email: adminEmail,
      username: adminUsername,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  })
  
  console.log('✅ Admin user set up successfully!')
  console.log('Email:', admin.email)
  console.log('Username:', admin.username)
  console.log('Role:', admin.role)
  console.log('')
  console.log('⚠️  IMPORTANT: Sign up with this email through Stack Auth, then run this script again to sync.')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
