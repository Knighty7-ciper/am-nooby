'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  FileText, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  PenSquare,
  Users,
  Bookmark
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/auth/user')
      if (!response.ok) {
        router.push('/handler/sign-in')
        return
      }

      const userData = await response.json()
      
      // Fetch user's posts
      const postsResponse = await fetch(`/api/posts?author=${userData.user.username}&limit=5`)
      const postsData = await postsResponse.json()

      setRecentPosts(postsData.posts || [])
      
      // Calculate stats
      const totalViews = (postsData.posts || []).reduce((sum: number, p: any) => sum + p.viewCount, 0)
      const totalLikes = (postsData.posts || []).reduce((sum: number, p: any) => sum + p.likeCount, 0)
      const totalComments = (postsData.posts || []).reduce((sum: number, p: any) => sum + p.commentCount, 0)

      setStats({
        totalPosts: userData.user.postCount || 0,
        totalViews,
        totalLikes,
        totalComments,
        followers: userData.user.followerCount || 0,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your writing overview</p>
        </div>
        <Button asChild size="lg">
          <Link href="/write">
            <PenSquare className="w-4 h-4 mr-2" />
            Write New Post
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.totalPosts || 0}</div>
          <div className="text-sm text-muted-foreground">Total Posts</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.totalViews?.toLocaleString() || 0}</div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.totalLikes || 0}</div>
          <div className="text-sm text-muted-foreground">Total Likes</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats?.followers || 0}</div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </Card>
      </div>

      {/* Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Posts</h2>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">View All</Link>
              </Button>
            </div>

            {recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map(post => (
                  <div key={post.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition">
                    <div className="flex-1">
                      <Link href={`/post/${post.slug}`} className="font-semibold hover:text-primary transition">
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {post.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {post.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {post.commentCount}
                        </span>
                        <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/write?id=${post.id}`}>Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Button asChild>
                  <Link href="/write">Create Your First Post</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" asChild>
                <Link href="/write">
                  <PenSquare className="w-4 h-4 mr-2" />
                  Write New Post
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Posts
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/bookmarks">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmarks
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Engagement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Comments</span>
                <span className="font-bold">{stats?.totalComments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Reading Time</span>
                <span className="font-bold">
                  {recentPosts.length > 0 
                    ? Math.round(recentPosts.reduce((sum, p) => sum + p.readingTime, 0) / recentPosts.length)
                    : 0}m
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
