import { prisma } from '@noobblog/database'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PostCard } from '@/components/post-card'
import { MapPin, Link as LinkIcon, Twitter, Github, Linkedin, Calendar, Users, FileText, Heart } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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
    title: `${user.name || user.username} - NoobBlog`,
    description: user.bio || `Profile of ${user.name || user.username}`,
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      posts: {
        where: {
          status: 'PUBLISHED',
        },
        include: {
          category: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      },
    },
  })

  if (!user) notFound()

  const totalLikes = user.posts.reduce((sum, post) => sum + post.likeCount, 0)
  const totalViews = user.posts.reduce((sum, post) => sum + post.viewCount, 0)

  return (
    <div className="container max-w-7xl py-8">
      {/* Profile Header */}
      <Card className="p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div>
            <Avatar className="h-32 w-32 ring-4 ring-primary/20">
              <img src={user.avatar || '/default-avatar.png'} alt={user.name || user.username} />
            </Avatar>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.name || user.username}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                {user.role !== 'READER' && (
                  <Badge className="mt-2" variant="secondary">
                    {user.role}
                  </Badge>
                )}
              </div>
              <Button>Follow</Button>
            </div>

            {user.bio && <p className="text-lg mb-4">{user.bio}</p>}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                  <LinkIcon className="w-4 h-4" />
                  Website
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {user.twitter && (
                <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </a>
              )}
              {user.github && (
                <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Github className="w-4 h-4" />
                  </Button>
                </a>
              )}
              {user.linkedin && (
                <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{user.postCount}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" /> Posts
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.followerCount}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> Followers
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalLikes}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Heart className="w-3 h-3" /> Likes
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
        </div>
      </Card>

      {/* Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Posts by {user.name || user.username}</h2>
        {user.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.posts.map(post => (
              <PostCard key={post.id} post={{ ...post, author: user }} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No posts yet</p>
          </Card>
        )}
      </div>
    </div>
  )
}
