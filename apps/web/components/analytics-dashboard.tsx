'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  Users,
  FileText,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import Link from 'next/link'

interface AnalyticsDashboardProps {
  userId: string
  role: string
}

export function AnalyticsDashboard({ userId, role }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<any>(null)
  const [topPosts, setTopPosts] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?userId=${userId}&range=${timeRange}`)
      const data = await response.json()
      setStats(data.stats)
      setTopPosts(data.topPosts)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4" />
    if (change < 0) return <ArrowDown className="w-4 h-4" />
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {role === 'ADMIN' ? 'Platform-wide' : 'Your content'} performance metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={timeRange === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7d')}
              >
                7 Days
              </Button>
              <Button
                variant={timeRange === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30d')}
              >
                30 Days
              </Button>
              <Button
                variant={timeRange === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('90d')}
              >
                90 Days
              </Button>
              <Button
                variant={timeRange === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('all')}
              >
                All Time
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading analytics...</p>
          </Card>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getChangeColor(stats?.viewsChange || 0)}`}>
                    {getChangeIcon(stats?.viewsChange || 0)}
                    <span>{Math.abs(stats?.viewsChange || 0)}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  {formatNumber(stats?.totalViews || 0)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Views</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getChangeColor(stats?.likesChange || 0)}`}>
                    {getChangeIcon(stats?.likesChange || 0)}
                    <span>{Math.abs(stats?.likesChange || 0)}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  {formatNumber(stats?.totalLikes || 0)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Likes</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getChangeColor(stats?.commentsChange || 0)}`}>
                    {getChangeIcon(stats?.commentsChange || 0)}
                    <span>{Math.abs(stats?.commentsChange || 0)}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  {formatNumber(stats?.totalComments || 0)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Comments</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getChangeColor(stats?.postsChange || 0)}`}>
                    {getChangeIcon(stats?.postsChange || 0)}
                    <span>{Math.abs(stats?.postsChange || 0)}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  {stats?.totalPosts || 0}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Published Posts</p>
              </Card>
            </div>

            {/* Top Posts */}
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Top Performing Posts</h2>
                <Badge variant="secondary">
                  {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : timeRange === '90d' ? 'Last 90 days' : 'All time'}
                </Badge>
              </div>
              <div className="space-y-4">
                {topPosts.length === 0 ? (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No posts published yet
                  </p>
                ) : (
                  topPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/post/${post.slug}`}>
                          <h4 className="font-semibold hover:text-primary transition-colors truncate">
                            {post.title}
                          </h4>
                        </Link>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(post.viewCount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(post.likeCount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{formatNumber(post.commentCount)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Additional Metrics for Admins */}
            {role === 'ADMIN' && (
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                      <Users className="w-5 h-5 text-cyan-500" />
                    </div>
                    <h3 className="font-semibold">Total Users</h3>
                  </div>
                  <p className="text-3xl font-bold">{formatNumber(stats?.totalUsers || 0)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    +{stats?.newUsers || 0} new this period
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="font-semibold">Avg. Engagement</h3>
                  </div>
                  <p className="text-3xl font-bold">{stats?.avgEngagement || 0}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Likes + Comments / Views
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-pink-500" />
                    </div>
                    <h3 className="font-semibold">Active Authors</h3>
                  </div>
                  <p className="text-3xl font-bold">{stats?.activeAuthors || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Published this period
                  </p>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
