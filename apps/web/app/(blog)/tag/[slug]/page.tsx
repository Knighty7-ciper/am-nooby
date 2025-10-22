import { prisma } from '@noobblog/database'
import { PostCard } from '@/components/post-card'
import { Card, CardContent } from '@/components/ui/card'
import { notFound } from 'next/navigation'

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
    description: `Browse posts tagged with #${tag.name}`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        include: {
          post: {
            where: { status: 'PUBLISHED' },
            include: {
              author: true,
              category: true,
            },
          },
        },
      },
      _count: {
        select: { posts: true },
      },
    },
  })

  if (!tag) notFound()

  const posts = tag.posts.map(pt => pt.post).filter(Boolean)

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">#{tag.name}</h1>
        <p className="text-sm text-muted-foreground">{tag._count.posts} posts</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No posts with this tag yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}