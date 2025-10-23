import { prisma } from '@noobblog/database'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, TrendingUp, Award, FileText } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 600 // Revalidate every 10 minutes

async function getAllAuthors() {
  return await prisma.user.findMany({
    where: {
      role: {
        in: ['AUTHOR', 'EDITOR', 'ADMIN'],
      },
      postCount: {
        gt: 0,
      },
    },
    orderBy: {
      followerCount: 'desc',
    },
    take: 100,
  })
}

async function getFeaturedAuthors() {
  return await prisma.user.findMany({
    where: {
      role: {
        in: ['AUTHOR', 'EDITOR', 'ADMIN'],
      },
      postCount: {
        gte: 5,
      },
    },
    orderBy: {
      followerCount: 'desc',
    },
    take: 6,
  })
}

export default async function AuthorsPage() {
  const [allAuthors, featuredAuthors] = await Promise.all([
    getAllAuthors(),
    getFeaturedAuthors(),
  ])

  const totalPosts = allAuthors.reduce((sum, author) => sum + author.postCount, 0)
  const totalFollowers = allAuthors.reduce((sum, author) => sum + author.followerCount, 0)

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Our Authors
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Meet the talented writers powering NoobBlog
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Total Authors</h3>
          </div>
          <p className="text-3xl font-bold">{allAuthors.length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Total Posts</h3>
          </div>
          <p className="text-3xl font-bold">{totalPosts}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Total Followers</h3>
          </div>
          <p className="text-3xl font-bold">{totalFollowers}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Top Writers</h3>
          </div>
          <p className="text-3xl font-bold">{featuredAuthors.length}</p>
        </Card>
      </div>

      {/* Featured Authors */}
      {featuredAuthors.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Featured Authors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAuthors.map(author => (
              <Card key={author.id} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-center">
                  <Link href={`/${author.username}`}>
                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                      <img src={author.avatar || '/default-avatar.png'} alt={author.name || author.username} />
                    </Avatar>
                  </Link>
                  <Link href={`/${author.username}`}>
                    <h3 className="text-xl font-bold hover:text-primary transition">
                      {author.name || author.username}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">@{author.username}</p>
                  
                  {author.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {author.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-6 mb-4 text-sm">
                    <div>
                      <div className="font-bold">{author.postCount}</div>
                      <div className="text-muted-foreground text-xs">Posts</div>
                    </div>
                    <div>
                      <div className="font-bold">{author.followerCount}</div>
                      <div className="text-muted-foreground text-xs">Followers</div>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/${author.username}`}>View Profile</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Authors Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Authors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allAuthors.map(author => (
            <Link key={author.id} href={`/${author.username}`}>
              <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <img src={author.avatar || '/default-avatar.png'} alt={author.name || author.username} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{author.name || author.username}</h3>
                    <p className="text-sm text-muted-foreground truncate">@{author.username}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>{author.postCount} posts</span>
                      <span>{author.followerCount} followers</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {allAuthors.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No authors found</p>
        </div>
      )}
    </div>
  )
}
