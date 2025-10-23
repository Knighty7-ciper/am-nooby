import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { AdminPanel } from '@/components/admin-panel'

export const metadata: Metadata = {
  title: 'Admin Panel | Blog',
  description: 'Platform administration and management',
}

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  return <AdminPanel />
}
