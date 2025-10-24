'use client'

import { useUser } from '@stackframe/stack'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, PenSquare, BarChart3, Users, Sparkles, TrendingUp } from 'lucide-react'

interface AuthenticatedHomeProps {
  user: any
}

function AuthenticatedHome({ user }: AuthenticatedHomeProps) {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Welcome back, {user?.displayName || 'Writer'}!</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Ready to Write
          <br />
          Your Next Story?
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Continue sharing your ideas, experiences, and expertise with the NoobBlog community.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/write">
              <PenSquare className="mr-2 w-4 h-4" />
              Write New Post
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">
              <BarChart3 className="mr-2 w-4 h-4" />
              View Dashboard
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div>
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-primary mr-2" />
              <p className="text-3xl font-bold">0</p>
            </div>
            <p className="text-sm text-muted-foreground">Your Posts</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              <p className="text-3xl font-bold">0</p>
            </div>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5 text-primary mr-2" />
              <p className="text-3xl font-bold">0</p>
            </div>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function GuestHome() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Welcome to the future of blogging</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Share Your Story
          <br />
          With The World
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of writers and creators sharing their ideas, experiences, and expertise on NoobBlog.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/handler/signup">
              Start Writing
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/explore">Explore Posts</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div>
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-primary mr-2" />
              <p className="text-3xl font-bold">10K+</p>
            </div>
            <p className="text-sm text-muted-foreground">Active Writers</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              <p className="text-3xl font-bold">50K+</p>
            </div>
            <p className="text-sm text-muted-foreground">Posts Published</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5 text-primary mr-2" />
              <p className="text-3xl font-bold">1M+</p>
            </div>
            <p className="text-sm text-muted-foreground">Monthly Readers</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AuthChecker() {
  const { user, isLoading } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    // Loading skeleton
    return (
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="w-64 h-6 bg-neutral-200 animate-pulse rounded-full mx-auto mb-6"></div>
          <div className="w-96 h-16 bg-neutral-200 animate-pulse rounded mx-auto mb-8"></div>
          <div className="w-80 h-6 bg-neutral-200 animate-pulse rounded mx-auto mb-8"></div>
        </div>
      </section>
    )
  }

  return user ? <AuthenticatedHome user={user} /> : <GuestHome />
}