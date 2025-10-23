import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, TrendingUp } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Series | Blog',
  description: 'Browse post series and learn in-depth topics',
}

export default async function SeriesPage() {
  const series = await prisma.series.findMany({
    orderBy: { postCount: 'desc' },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Learning Paths</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Post Series
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Dive deep into comprehensive topics with our curated series
          </p>
        </div>
      </section>

      {/* Series Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {series.map(s => (
            <Card key={s.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {s.coverImage && (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={s.coverImage}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <Badge className="absolute top-4 right-4 bg-primary">
                    {s.postCount} {s.postCount === 1 ? 'post' : 'posts'}
                  </Badge>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link href={`/series/${s.slug}`}>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {s.name}
                      </h3>
                    </Link>
                    {!s.coverImage && (
                      <Badge variant="secondary">
                        {s.postCount} {s.postCount === 1 ? 'post' : 'posts'}
                      </Badge>
                    )}
                  </div>
                </div>
                {s.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {s.description}
                  </p>
                )}
                {s.posts.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Latest in series:</p>
                    {s.posts.map(post => (
                      <Link
                        key={post.id}
                        href={`/post/${post.slug}`}
                        className="block text-sm text-primary hover:underline"
                      >
                        • {post.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {series.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No series yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for comprehensive learning series
            </p>
          </Card>
        )}
      </section>
    </div>
  )
}
