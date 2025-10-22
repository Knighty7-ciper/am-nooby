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
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

export default async function AdminCommentsPage() {
  const user = await stackServerApp.getUser()
  
  if (!user) redirect('/sign-in')

  const userProfile = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (userProfile?.role !== 'ADMIN') {
    redirect('/')
  }

  const comments = await prisma.comment.findMany({
    include: {
      author: true,
      post: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Comments Management</h1>
          <p className="text-muted-foreground">Monitor and moderate comments</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{comment.author.name}</div>
                      <div className="text-sm text-muted-foreground">@{comment.author.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{comment.post.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md truncate">{comment.content}</div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm">Delete</Button>
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