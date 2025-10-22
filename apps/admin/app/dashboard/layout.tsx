'use client'

import { AdminSidebar } from '@/components/admin-sidebar'
import { stackServerApp } from '@/lib/stack-server'
import { redirect } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto ml-64">
        {children}
      </main>
    </div>
  )
}