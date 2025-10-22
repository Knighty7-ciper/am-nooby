import { stackServerApp } from '@/lib/stack-server'
import { prisma } from '@noobblog/database'
import { PostCard } from '@/components/post-card'
import { Card, CardContent } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default async function BookmarksPage() {
  const user = await stackServerApp.getUser()
  
  if (!user) redirect('/sign-in')

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      post: {
        include: {
          author: true,
          category: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Bookmarks</h1>
        <p className="text-muted-foreground">Posts you've saved for later</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid gap-6">
          {bookmarks.map(({ post }) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't bookmarked any posts yet</p>
            <p className="text-sm">Start exploring and save posts you want to read later!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}