import { prisma } from '@noobblog/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export async function TrendingAuthors() {
  const authors = await prisma.user.findMany({
    where: {
      role: { in: ['AUTHOR', 'EDITOR', 'ADMIN'] },
      postCount: { gt: 0 },
    },
    orderBy: [
      { followerCount: 'desc' },
      { postCount: 'desc' },
    ],
    take: 6,
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {authors.map((author) => (
        <div key={author.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
          <Link href={`/@${author.username}`}>
            <Avatar className="h-16 w-16">
              <AvatarImage src={author.avatar || undefined} />
              <AvatarFallback>{author.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/@${author.username}`}>
              <h3 className="font-semibold truncate hover:text-primary transition-colors">
                {author.name || author.username}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground truncate">
              @{author.username}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>{author.postCount} posts</span>
              <span>•</span>
              <span>{author.followerCount} followers</span>
            </div>
          </div>
          <Button size="sm" variant="outline">Follow</Button>
        </div>
      ))}
    </div>
  )
}
