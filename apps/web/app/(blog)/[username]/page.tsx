import { prisma } from '@noobblog/database'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PostCard } from '@/components/post-card'
import { MapPin, Link as LinkIcon, Calendar, Users } from 'lucide-react'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface PageProps {
  params: { username: string }
}

export async function generateMetadata({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
  })

  if (!user) return { title: 'User Not Found' }

  return {
    title: `${user.name || user.username} (@${user.username}) - NoobBlog`,
    description: user.bio || `Check out ${user.name || user.username}'s profile on NoobBlog`,
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          author: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: 20,
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) notFound()

  return (
    <div className="container max-w-6xl py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-32 w-32">
              <img src={user.avatar || '/default-avatar.png'} alt={user.name || user.username} />
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user.name || user.username}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <Badge className="mt-2">{user.role}</Badge>
                </div>
                <Button>Follow</Button>
              </div>
              
              {user.bio && <p className="text-lg mb-4">{user.bio}</p>}
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                    <LinkIcon className="h-4 w-4" />
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </div>
              </div>
              
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <span className="font-bold">{user._count.posts}</span>
                  <span className="text-muted-foreground">Posts</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{user._count.followers}</span>
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{user._count.following}</span>
                  <span className="text-muted-foreground">Following</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Posts by {user.name || user.username}</h2>
        {user.posts.length > 0 ? (
          <div className="grid gap-6">
            {user.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No posts yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}