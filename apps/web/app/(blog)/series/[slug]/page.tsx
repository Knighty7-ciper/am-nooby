import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight, Clock, Eye } from 'lucide-react'
import prisma from '@/lib/prisma'

interface SeriesPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const series = await prisma.series.findUnique({
    where: { slug: params.slug },
  })

  if (!series) return { title: 'Series Not Found' }

  return {
    title: `${series.name} | Series`,
    description: series.description || `Read all posts in the ${series.name} series`,
  }
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const series = await prisma.series.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'asc' },
        include: {
          author: {
            select: {
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
    },
  })

  if (!series) notFound()

  const totalReadingTime = series.posts.reduce((acc, post) => acc + post.readingTime, 0)
  const totalViews = series.posts.reduce((acc, post) => acc + post.viewCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        {series.coverImage && (
          <div className="absolute inset-0">
            <img
              src={series.coverImage}
              alt={series.name}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-950"></div>
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Series</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {series.name}
          </h1>
          {series.description && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {series.description}
            </p>
          )}
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{series.posts.length} articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>~{totalReadingTime} min total</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{totalViews.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </section>

      {/* Posts List */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Articles in this series</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Read in order for the best learning experience
          </p>
        </div>

        <div className="space-y-4">
          {series.posts.map((post, index) => (
            <Card key={post.id} className="p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex gap-6">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <Link href={`/post/${post.slug}`}>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      {post.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-lg shrink-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <Link
                        href={`/${post.author.username}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <img
                          src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}`}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{post.author.name}</span>
                      </Link>
                      <span>•</span>
                      <span>{post.readingTime} min read</span>
                      <span>•</span>
                      <span>{post.viewCount.toLocaleString()} views</span>
                    </div>
                    <Link href={`/post/${post.slug}`}>
                      <Button size="sm" className="group">
                        Read
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {series.posts.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              This series is still being written. Check back soon!
            </p>
          </Card>
        )}
      </section>
    </div>
  )
}
