import { prisma } from '@noobblog/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  FileText, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  UserPlus,
  Mail
} from 'lucide-react'

export const revalidate = 60

async function getAnalytics() {
  const [totalUsers, totalPosts, totalPublished, totalDrafts, recentViews] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.view.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
  ])

  return {
    totalUsers,
    totalPosts,
    totalPublished,
    totalDrafts,
    recentViews,
  }
}

export default async function DashboardPage() {
  const stats = await getAnalytics()

  const metrics = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts.toLocaleString(),
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Published',
      value: stats.totalPublished.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Monthly Views',
      value: stats.recentViews.toLocaleString(),
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">5 new users registered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">12 new posts published</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">23 newsletter signups</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">Getting Started with Next.js 14</p>
                  <p className="text-xs text-muted-foreground">by John Doe</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span className="text-xs">12.5k</span>
                </div>
              </div>
              <div className="flex items-start justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">Mastering TypeScript Patterns</p>
                  <p className="text-xs text-muted-foreground">by Jane Smith</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span className="text-xs">8.2k</span>
                </div>
              </div>
              <div className="flex items-start justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">Building RESTful APIs with Node.js</p>
                  <p className="text-xs text-muted-foreground">by Mike Johnson</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span className="text-xs">6.8k</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
