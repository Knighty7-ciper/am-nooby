'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  PenSquare,  
  Bell,
  Settings,
  LogOut,
  User,
  BarChart3,
  BookMarked,
  Users,
  BookOpen,
  Shield,
  TrendingUp
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { useUser } from '@stackframe/stack'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const { user, isLoading } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await user?.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-neutral-200 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-orange-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-orange-sm group-hover:shadow-orange-md transition-all duration-300 group-hover:scale-110">
              <img 
                src="/logo.png" 
                alt="NoobBlog Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-black text-2xl hidden sm:inline-block text-neutral-900 group-hover:text-primary transition-colors">NoobBlog</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-base">
            <Link href="/explore" className="text-neutral-700 font-semibold hover:text-primary transition-colors relative group">
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/trending" className="text-neutral-700 font-semibold hover:text-primary transition-colors relative group">
              Trending
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/tags" className="text-neutral-700 font-semibold hover:text-primary transition-colors relative group">
              Tags
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/series" className="text-neutral-700 font-semibold hover:text-primary transition-colors relative group">
              Series
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/authors" className="text-neutral-700 font-semibold hover:text-primary transition-colors relative group">
              Authors
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="hidden md:flex relative">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="w-72 h-11 border-2 border-neutral-300 focus:border-primary rounded-xl"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hover:bg-primary-50"
              >
                <Search className="h-5 w-5 text-neutral-700" />
              </Button>
            )}
          </div>

          {isLoading ? (
            // Loading state
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-neutral-200 animate-pulse rounded-full" />
              <div className="w-20 h-8 bg-neutral-200 animate-pulse rounded" />
            </div>
          ) : user ? (
            <>
              {/* Write button */}
              <Button asChild className="hidden sm:flex">
                <Link href="/write">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Write
                </Link>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </Link>
              </Button>

              {/* User menu */}
              <div className="relative group">
                <Avatar className="cursor-pointer ring-2 ring-primary-100 hover:ring-primary transition-all duration-300">
                  <AvatarImage src={user?.imageUrl || 'https://github.com/shadcn.png'} />
                  <AvatarFallback className="bg-primary-50 text-primary font-bold">
                    {user?.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-orange-lg py-2">
                    <div className="px-5 py-2 border-b border-neutral-100 mb-2">
                      <p className="font-semibold text-sm">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-neutral-500">{user?.primaryEmail || user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50 hover:text-primary transition-colors font-medium">
                      <BarChart3 className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link href="/write" className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50 hover:text-primary transition-colors font-medium">
                      <PenSquare className="h-5 w-5" />
                      <span>Write Post</span>
                    </Link>
                    <Link href="/analytics" className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50 hover:text-primary transition-colors font-medium">
                      <TrendingUp className="h-5 w-5" />
                      <span>Analytics</span>
                    </Link>
                    <Link href="/bookmarks" className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50 hover:text-primary transition-colors font-medium">
                      <BookMarked className="h-5 w-5" />
                      <span>Bookmarks</span>
                    </Link>
                    <Link href="/following" className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50 hover:text-primary transition-colors font-medium">
                      <Users className="h-5 w-5" />
                      <span>Following</span>
                    </Link>
                    <Link href="/notifications" className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50 hover:text-primary transition-colors font-medium">
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50 hover:text-primary transition-colors font-medium">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <hr className="my-2 border-neutral-200" />
                    <Link href="/admino77" className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors font-medium">
                      <Shield className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </Link>
                    <hr className="my-2 border-neutral-200" />
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 w-full text-left text-destructive hover:text-red-700 transition-colors font-medium"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/handler/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/handler/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
