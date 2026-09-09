import { prisma } from '@noobblog/database'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { CategoryList } from '@/components/category-list'
import { TrendingAuthors } from '@/components/trending-authors'
import { Newsletter } from '@/components/newsletter'
import { AuthChecker } from '@/components/auth-checker'

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
        {/* Dynamic Hero Section based on Auth Status */}
        <AuthChecker />

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Featured Posts</h2>
                <Button variant="ghost" asChild>
                  <Link href="/explore?featured=true">
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
