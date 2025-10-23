import { PrismaClient, SubscriptionPlan, SubscriptionStatus, UserRole } from '@noobblog/database'

const prisma = new PrismaClient()

async function seedAdminAccounts() {
  console.log('🌱 Seeding admin accounts...')

  try {
    // Admin Account 1: PRO Plan (for testing pro features)
    const admin1 = await prisma.user.upsert({
      where: { email: 'bknglabs.dev@gmail.com' },
      update: {
        role: UserRole.ADMIN,
        subscriptionPlan: SubscriptionPlan.PRO,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionEndsAt: null, // Lifetime access
      },
      create: {
        id: 'admin-pro-seed',
        email: 'bknglabs.dev@gmail.com',
        username: '@sensei-knighty7',
        name: 'Sensei Knighty',
        role: UserRole.ADMIN,
        subscriptionPlan: SubscriptionPlan.PRO,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionEndsAt: null, // Lifetime access
        emailVerified: true,
        bio: 'Admin account with PRO subscription for testing and management',
      },
    })
    console.log('✅ Created/Updated PRO Admin:', admin1.email)

    // Admin Account 2: FREE Plan (for testing free tier limitations)
    const admin2 = await prisma.user.upsert({
      where: { email: 'admin-free@noobblog.com' },
      update: {
        role: UserRole.ADMIN,
        subscriptionPlan: SubscriptionPlan.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      },
      create: {
        id: 'admin-free-seed',
        email: 'admin-free@noobblog.com',
        username: '@admin-free',
        name: 'Admin (Free)',
        role: UserRole.ADMIN,
        subscriptionPlan: SubscriptionPlan.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        emailVerified: true,
        bio: 'Admin account with FREE subscription for testing limitations',
      },
    })
    console.log('✅ Created/Updated FREE Admin:', admin2.email)

    console.log('\n🎉 Admin accounts seeded successfully!')
    console.log('\n📝 Account Details:')
    console.log('─'.repeat(60))
    console.log('PRO Admin:')
    console.log('  Email: bknglabs.dev@gmail.com')
    console.log('  Username: @sensei-knighty7')
    console.log('  Plan: PRO (Lifetime)')
    console.log('\nFREE Admin:')
    console.log('  Email: admin-free@noobblog.com')
    console.log('  Username: @admin-free')
    console.log('  Plan: FREE')
    console.log('─'.repeat(60))
    console.log('\n⚠️  IMPORTANT:')
    console.log('   Sign in with Stack Auth using these emails.')
    console.log('   No payment required - accounts already configured!')
  } catch (error) {
    console.error('❌ Error seeding admin accounts:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed
seedAdminAccounts()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
