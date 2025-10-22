'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { 
  Search, 
  Moon, 
  Sun, 
  PenSquare,  
  Bell,
  Settings,
  LogOut,
  User,
  BarChart3,
  BookMarked
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from './ui/input'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock user - replace with actual auth
  const user = null // Will be replaced with Stack Auth

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">NoobBlog</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/trending" className="text-muted-foreground hover:text-foreground transition-colors">
              Trending
            </Link>
            <Link href="/tags" className="text-muted-foreground hover:text-foreground transition-colors">
              Tags
            </Link>
            <Link href="/authors" className="text-muted-foreground hover:text-foreground transition-colors">
              Authors
            </Link>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="w-64"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              {/* Write button */}
              <Button asChild className="hidden sm:flex">
                <Link href="/dashboard/new-post">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Write
                </Link>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>

              {/* User menu */}
              <div className="relative group">
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/images/design-mode/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-popover border rounded-lg shadow-lg py-2">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-accent">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Profile</span>
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-accent">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                    <Link href="/bookmarks" className="flex items-center gap-3 px-4 py-2 hover:bg-accent">
                      <BookMarked className="h-4 w-4" />
                      <span className="text-sm">Bookmarks</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-accent">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </Link>
                    <hr className="my-2" />
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-accent w-full text-left text-destructive">
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
