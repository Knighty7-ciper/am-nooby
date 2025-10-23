import { prisma } from '@noobblog/database'
import { PostCard } from '@/components/post-card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Flame, Calendar } from 'lucide-react'
import { startOfDay, subDays } from 'date-fns'

export const revalidate = 300 // Revalidate every 5 minutes

async function getTrendingPosts(period: string = '7d') {
  const days = period === '24h' ? 1 : period === '7d' ? 7 : 30
  const since = startOfDay(subDays(new Date(), days))

  // Calculate trending score: (likes * 2 + comments * 3 + views) / age_in_hours
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        gte: since,
      },
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: { tag: true },
      },
    },
    take: 50,
  })

  // Calculate trending score
  const postsWithScore = posts.map(post => {
    const ageInHours = post.publishedAt 
      ? (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60)
      : 1
    
    const score = (post.likeCount * 2 + post.commentCount * 3 + post.viewCount) / Math.max(ageInHours, 1)
    
    return { ...post, trendingScore: score }
  })

  // Sort by trending score
  postsWithScore.sort((a, b) => b.trendingScore - a.trendingScore)

  return postsWithScore.slice(0, 24)
}

async function getTopCategories() {
  return await prisma.category.findMany({
    orderBy: {
      postCount: 'desc',
    },
    take: 6,
  })
}

export default async function TrendingPage() {
  const [trendingPosts, topCategories] = await Promise.all([
    getTrendingPosts('7d'),
    getTopCategories(),
  ])

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Trending Posts
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          The most popular content from the past week
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Hot Right Now</h3>
          </div>
          <p className="text-2xl font-bold">{trendingPosts.length}</p>
          <p className="text-sm text-muted-foreground">Trending posts</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Time Period</h3>
          </div>
          <p className="text-2xl font-bold">7 Days</p>
          <p className="text-sm text-muted-foreground">Past week</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Top Categories</h3>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {topCategories.slice(0, 3).map(cat => (
              <Badge key={cat.id} variant="secondary" className="text-xs">
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Posts */}
      {trendingPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPosts.map((post, index) => (
            <div key={post.id} className="relative">
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
                    #{index + 1}
                  </Badge>
                </div>
              )}
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Flame className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No trending posts yet</p>
        </div>
      )}
    </div>
  )
}
