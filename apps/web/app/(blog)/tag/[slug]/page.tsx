import { prisma } from '@noobblog/database'
import { PostCard } from '@/components/post-card'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Hash, TrendingUp, FileText, Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
  })

  if (!tag) return { title: 'Tag Not Found' }

  return {
    title: `#${tag.name} - NoobBlog`,
    description: `Explore posts tagged with #${tag.name}`,
  }
}

export default async function TagDetailPage({ params }: PageProps) {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        include: {
          post: {
            include: {
              author: true,
              category: true,
              tags: {
                include: { tag: true },
              },
            },
          },
        },
        orderBy: {
          post: {
            publishedAt: 'desc',
          },
        },
      },
    },
  })

  if (!tag) notFound()

  const posts = tag.posts.map(pt => pt.post).filter(p => p.status === 'PUBLISHED')

  // Get related tags
  const relatedTags = await prisma.tag.findMany({
    where: {
      AND: [
        {
          posts: {
            some: {
              post: {
                tags: {
                  some: {
                    tagId: tag.id,
                  },
                },
              },
            },
          },
        },
        {
          id: { not: tag.id },
        },
      ],
    },
    take: 10,
    orderBy: {
      postCount: 'desc',
    },
  })

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-4 bg-gradient-to-br from-primary to-primary/60 rounded-lg">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              #{tag.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
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
          <p className="text-3xl font-bold">{posts.length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Views</h3>
          </div>
          <p className="text-3xl font-bold">
            {posts.reduce((sum, p) => sum + p.viewCount, 0)}
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Latest Post</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {posts[0]?.publishedAt
              ? new Date(posts[0].publishedAt).toLocaleDateString()
              : 'N/A'}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Hash className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No posts with this tag yet</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Tags */}
          {relatedTags.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Related Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map(rt => (
                  <Link key={rt.id} href={`/tag/${rt.slug}`}>
                    <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition">
                      #{rt.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Popular Tags */}
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Popular Tags
            </h3>
            <Link href="/tags">
              <Badge className="w-full justify-center py-2">
                Explore All Tags
              </Badge>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
