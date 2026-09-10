import { prisma } from '@noobblog/database'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { CategoryList } from '@/components/category-list'
import { TrendingAuthors } from '@/components/trending-authors'
import { Newsletter } from '@/components/newsletter'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react'

export const revalidate = 60 // Revalidate every 60 seconds

async function getRealtimeStats() {
  const [totalAuthors, totalPosts, totalUsers] = await Promise.all([
    prisma.user.count({
      where: {
        role: { in: ['AUTHOR', 'EDITOR', 'ADMIN'] },
        postCount: { gt: 0 },
      },
    }),
    prisma.post.count({
      where: { status: 'PUBLISHED' },
    }),
    prisma.user.count(),
  ])
  
  return {
    authors: totalAuthors,
    posts: totalPosts,
    readers: totalUsers,
  }
}

async function getFeaturedPosts() {
  return await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      featured: true,
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 3,
  })
}

async function getRecentPosts() {
  return await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 12,
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      postCount: 'desc',
    },
    take: 8,
  })
}

export default async function Home() {
  const [featuredPosts, recentPosts, categories, stats] = await Promise.all([
    getFeaturedPosts(),
    getRecentPosts(),
    getCategories(),
    getRealtimeStats(),
  ])

  return (
    <>
      <Suspense fallback={<header className="h-20 border-b-2 border-neutral-200 bg-white" />}>
        <Header />
      </Suspense>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-4 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-primary-50/30" />
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/10 blur-3xl rounded-full" />
          
          <div className="container mx-auto max-w-6xl text-center relative z-10">

            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-neutral-900 leading-tight">
              Share Your Story
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-700 to-primary-900 bg-clip-text text-transparent">
                With The World
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of writers and creators sharing their ideas, experiences, and expertise on NoobBlog.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold shadow-orange-md hover:shadow-orange-lg hover:-translate-y-1 transition-all duration-300" 
                asChild
              >
                <Link href="/handler/sign-up">
                  Start Writing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg font-semibold border-2 border-primary hover:bg-primary-50 hover:border-primary-700 transition-all duration-300" 
                asChild
              >
                <Link href="/explore">Explore Posts</Link>
              </Button>
            </div>
            
            {/* Real-time Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mt-20 max-w-3xl mx-auto">
              <div className="p-6 rounded-2xl bg-white shadow-orange-sm hover:shadow-orange-md transition-all duration-300 border border-neutral-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 rounded-lg bg-primary-50 mr-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-4xl font-black text-neutral-900">{stats.authors}</p>
                </div>
                <p className="text-sm font-medium text-neutral-600">Active Writers</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-white shadow-orange-sm hover:shadow-orange-md transition-all duration-300 border border-neutral-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 rounded-lg bg-primary-50 mr-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-4xl font-black text-neutral-900">{stats.posts}</p>
                </div>
                <p className="text-sm font-medium text-neutral-600">Posts Published</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-white shadow-orange-sm hover:shadow-orange-md transition-all duration-300 border border-neutral-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 rounded-lg bg-primary-50 mr-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-4xl font-black text-neutral-900">{stats.readers}</p>
                </div>
                <p className="text-sm font-medium text-neutral-600">Community Members</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-2">Featured Posts</h2>
                  <p className="text-neutral-600">Handpicked stories from our community</p>
                </div>
                <Button variant="ghost" className="text-primary hover:text-primary-700" asChild>
                  <Link href="/trending">
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} featured />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary-50/50 to-background">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-2">Browse by Category</h2>
              <p className="text-neutral-600">Explore content tailored to your interests</p>
            </div>
            <CategoryList categories={categories} />
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-2">Recent Posts</h2>
                <p className="text-neutral-600">Fresh content from our writers</p>
              </div>
              <Button variant="ghost" className="text-primary hover:text-primary-700" asChild>
                <Link href="/explore">
                  View All <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* Trending Authors */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary-50/50 to-background">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-2">Trending Authors</h2>
              <p className="text-neutral-600">Follow the most influential voices</p>
            </div>
            <TrendingAuthors />
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <Newsletter />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
