import { prisma } from '@noobblog/database'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Hash, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { TagCloud } from '@/components/tag-cloud'

export const revalidate = 600 // Revalidate every 10 minutes

async function getAllTags() {
  return await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: {
      postCount: 'desc',
    },
  })
}

async function getPopularTags() {
  return await prisma.tag.findMany({
    where: {
      postCount: {
        gt: 0,
      },
    },
    orderBy: {
      postCount: 'desc',
    },
    take: 20,
  })
}

export default async function TagsPage() {
  const [allTags, popularTags] = await Promise.all([
    getAllTags(),
    getPopularTags(),
  ])

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-lg">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Explore Tags
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Discover topics and find content that interests you
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Hash className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Tags</h3>
          </div>
          <p className="text-3xl font-bold">{allTags.length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Active Tags</h3>
          </div>
          <p className="text-3xl font-bold">{allTags.filter(t => t.postCount > 0).length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Hash className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Total Posts</h3>
          </div>
          <p className="text-3xl font-bold">{allTags.reduce((sum, t) => sum + t.postCount, 0)}</p>
        </Card>
      </div>

      {/* Popular Tags Cloud */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Tags</h2>
        <TagCloud tags={popularTags} />
      </div>

      {/* All Tags Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Tags</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTags.map(tag => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Hash className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tag.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tag._count?.posts || tag.postCount} posts
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{tag._count?.posts || tag.postCount}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {allTags.length === 0 && (
        <div className="text-center py-12">
          <Hash className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No tags found</p>
        </div>
      )}
    </div>
  )
}
