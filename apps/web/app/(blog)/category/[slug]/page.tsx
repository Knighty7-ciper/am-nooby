import { prisma } from '@noobblog/database'
import { PostCard } from '@/components/post-card'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  })

  if (!category) return { title: 'Category Not Found' }

  return {
    title: `${category.name} - NoobBlog`,
    description: category.description || `Explore posts in ${category.name}`,
  }
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: {
          status: 'PUBLISHED',
        },
        include: {
          author: true,
          category: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      },
    },
  })

  if (!category) notFound()

  // Get other categories
  const otherCategories = await prisma.category.findMany({
    where: {
      id: { not: category.id },
    },
    orderBy: {
      postCount: 'desc',
    },
    take: 6,
  })

  const totalViews = category.posts.reduce((sum, post) => sum + post.viewCount, 0)
  const totalLikes = category.posts.reduce((sum, post) => sum + post.likeCount, 0)

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {category.icon && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: category.color || '#6366f1' }}>
              <span className="text-2xl">{category.icon}</span>
            </div>
          )}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-muted-foreground mt-2">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Posts</h3>
          </div>
          <p className="text-3xl font-bold">{category.posts.length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Views</h3>
          </div>
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Likes</h3>
          </div>
          <p className="text-3xl font-bold">{totalLikes}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {category.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No posts in this category yet</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Other Categories</h3>
            <div className="space-y-2">
              {otherCategories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-muted transition">
                    {cat.icon && <span className="text-xl">{cat.icon}</span>}
                    <div className="flex-1">
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {cat.postCount} posts
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
