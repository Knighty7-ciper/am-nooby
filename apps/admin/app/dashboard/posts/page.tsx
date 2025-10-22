import { stackServerApp } from '@/lib/stack-server'
import { prisma } from '@noobblog/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default async function AdminPostsPage() {
  const user = await stackServerApp.getUser()
  
  if (!user) redirect('/sign-in')

  const userProfile = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (userProfile?.role !== 'ADMIN') {
    redirect('/')
  }

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Posts Management</h1>
          <p className="text-muted-foreground">Manage all blog posts</p>
        </div>
        <Link href="/dashboard/new-post">
          <Button>New Post</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="max-w-xs truncate font-medium">{post.title}</div>
                  </TableCell>
                  <TableCell>{post.author.name || post.author.username}</TableCell>
                  <TableCell>{post.category?.name || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === 'PUBLISHED'
                          ? 'default'
                          : post.status === 'DRAFT'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.viewCount}</TableCell>
                  <TableCell>{post.likeCount}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}