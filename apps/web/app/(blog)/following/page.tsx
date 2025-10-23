import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { FollowingList } from '@/components/following-list'

export const metadata: Metadata = {
  title: 'Following | Blog',
  description: 'People you follow',
}

export default async function FollowingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/api/auth/signin?callbackUrl=/following')
  }

  return <FollowingList userId={user.id} />
}
