'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserMinus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface FollowingListProps {
  userId: string
}

export function FollowingList({ userId }: FollowingListProps) {
  const [following, setFollowing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFollowing()
  }, [userId])

  const loadFollowing = async () => {
    try {
      const response = await fetch(`/api/follow?userId=${userId}&type=following`)
      const data = await response.json()
      setFollowing(data)
    } catch (error) {
      console.error('Failed to load following:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async (followingId: string) => {
    try {
      await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId }),
      })
      setFollowing(prev => prev.filter(f => f.id !== followingId))
    } catch (error) {
      console.error('Failed to unfollow:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Following</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {following.length} {following.length === 1 ? 'person' : 'people'}
              </p>
            </div>
          </div>
        </div>

        {/* Following List */}
        <div className="space-y-3">
          {loading ? (
            <Card className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading...</p>
            </Card>
          ) : following.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Not following anyone yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Discover and follow authors to see their latest posts
              </p>
              <Link href="/authors">
                <Button>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Browse Authors
                </Button>
              </Link>
            </Card>
          ) : (
            following.map(user => (
              <Card key={user.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Link href={`/${user.username}`}>
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/${user.username}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                            {user.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">@{user.username}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfollow(user.id)}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </Button>
                    </div>
                    {user.bio && (
                      <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{user.postCount || 0} posts</span>
                      <span>{user.followerCount || 0} followers</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
