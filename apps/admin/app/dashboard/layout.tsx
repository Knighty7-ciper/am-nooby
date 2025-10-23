'use client'

import { AdminSidebar } from '@/components/admin-sidebar'
import { StackServerApp } from '@stackframe/stack'
import { redirect } from 'next/navigation'

// Create StackServerApp inline to avoid server-only import
const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    home: '/',
    signIn: '/handler/sign-in',
    signUp: '/handler/sign-up',
    afterSignIn: '/',
    afterSignUp: '/',
  },
})

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