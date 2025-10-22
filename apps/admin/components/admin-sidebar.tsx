'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageCircle,
  FolderTree,
  Tag,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Posts', href: '/dashboard/posts', icon: FileText },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Comments', href: '/dashboard/comments', icon: MessageCircle },
  { name: 'Categories', href: '/dashboard/categories', icon: FolderTree },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-muted/30">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-xl font-bold">NoobBlog Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}