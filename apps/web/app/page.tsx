import { prisma } from '@noobblog/database'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { CategoryList } from '@/components/category-list'
import { TrendingAuthors } from '@/components/trending-authors'
import { Newsletter } from '@/components/newsletter'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react'

export const revalidate = 60 // Revalidate every 60 seconds

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
  const [featuredPosts, recentPosts, categories] = await Promise.all([
    getFeaturedPosts(),
    getRecentPosts(),
    getCategories(),
  ])

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
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

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Featured Posts</h2>
                <Button variant="ghost" asChild>
                  <Link href="/trending">
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} featured />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
            <CategoryList categories={categories} />
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Recent Posts</h2>
              <Button variant="ghost" asChild>
                <Link href="/explore">
                  View All <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* Trending Authors */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold mb-8">Trending Authors</h2>
            <TrendingAuthors />
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Newsletter />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
