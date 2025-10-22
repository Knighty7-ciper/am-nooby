import { prisma } from '@noobblog/database'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CommentSection } from '@/components/comment-section'
import { Heart, Bookmark, Share2, Eye, Clock } from 'lucide-react'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
  }
}

export default async function PostPage({ params }: PageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      category: true,
      tags: {
        include: { tag: true },
      },
    },
  })

  if (!post) notFound()

  // Get comments
  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id,
      parentId: null,
    },
    include: {
      user: true,
      replies: {
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <article className="container max-w-4xl py-8">
      {/* Post Header */}
      <header className="mb-8">
        {post.category && (
          <Link href={`/category/${post.category.slug}`}>
            <Badge className="mb-4">{post.category.name}</Badge>
          </Link>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        
        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
        )}

        {/* Author & Meta Info */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link href={`/@${post.author.username}`} className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <img src={post.author.avatar || '/default-avatar.png'} alt={post.author.name || post.author.username} />
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {post.publishedAt
                  ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
                  : 'Draft'}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.viewCount}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-2 mb-8 pb-8 border-b">
        <Button variant="outline" size="sm">
          <Heart className="h-4 w-4 mr-1" />
          {post.likeCount}
        </Button>
        <Button variant="outline" size="sm">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b">
          {post.tags.map(({ tag }) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Badge variant="secondary">#{tag.name}</Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Author Bio */}
      <div className="mb-12 p-6 bg-muted rounded-lg">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <img src={post.author.avatar || '/default-avatar.png'} alt={post.author.name || post.author.username} />
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Written by {post.author.name}</h3>
            {post.author.bio && <p className="text-muted-foreground mb-3">{post.author.bio}</p>}
            <Link href={`/@${post.author.username}`}>
              <Button variant="outline" size="sm">View Profile</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} comments={comments} />
    </article>
  )
}