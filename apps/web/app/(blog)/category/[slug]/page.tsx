import { prisma } from '@noobblog/database'
import { PostCard } from '@/components/post-card'
import { Card, CardContent } from '@/components/ui/card'
import { notFound } from 'next/navigation'

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
    description: category.description || `Browse posts in ${category.name} category`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        include: {
          author: true,
          category: true,
        },
        orderBy: { publishedAt: 'desc' },
      },
      _count: {
        select: { posts: true },
      },
    },
  })

  if (!category) notFound()

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-muted-foreground">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">{category._count.posts} posts</p>
      </div>

      {category.posts.length > 0 ? (
        <div className="grid gap-6">
          {category.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No posts in this category yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
