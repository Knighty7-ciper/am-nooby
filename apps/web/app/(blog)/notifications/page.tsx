import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { NotificationCenter } from '@/components/notification-center'

export const metadata: Metadata = {
  title: 'Notifications | Blog',
  description: 'View your notifications and stay updated',
}

export default async function NotificationsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/api/auth/signin?callbackUrl=/notifications')
  }

  return <NotificationCenter />
}
