import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  PenSquare,
  Settings,
  BookMarked,
  Users,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard - NoobBlog',
  description: 'Manage your posts and track your performance',
}

export default function DashboardPage() {
  // Mock data - will be replaced with real data from Stack Auth + Prisma
  const stats = {
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  }

  const recentPosts = []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30">
        <div className="container mx-auto max-w-7xl py-8 px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new-post">
                <PenSquare className="h-4 w-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Published articles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All-time views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLikes}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Engagement score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalComments}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total discussions
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentPosts.length > 0 ? (
                    <div className="space-y-4">
                      {/* Posts will be listed here */}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">No posts yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start writing your first post to see it here
                      </p>
                      <Button asChild>
                        <Link href="/dashboard/new-post">
                          <PenSquare className="h-4 w-4 mr-2" />
                          Create Post
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/new-post">
                      <PenSquare className="h-4 w-4 mr-2" />
                      Write New Post
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/bookmarks">
                      <BookMarked className="h-4 w-4 mr-2" />
                      My Bookmarks
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Avg. Read Time</span>
                      </div>
                      <span className="text-sm font-medium">0 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Views/Post</span>
                      </div>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Followers</span>
                      </div>
                      <span className="text-sm font-medium">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
