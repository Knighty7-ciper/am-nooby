import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Clock, Heart, MessageCircle, Bookmark } from 'lucide-react'

interface PostCardProps {
  post: any // Replace with proper type
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Cover Image */}
      {post.coverImage && (
        <Link href={`/post/${post.slug}`} className="block relative h-48 overflow-hidden">
          <Image
            src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-white">Featured</Badge>
            </div>
          )}
        </Link>
      )}

      <div className="p-6">
        {/* Category */}
        {post.category && (
          <Link 
            href={`/category/${post.category.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <Link href={`/post/${post.slug}`}>
          <h3 className="mt-2 text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-2 text-muted-foreground text-sm line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((postTag: any) => (
              <Link
                key={postTag.tag.id}
                href={`/tag/${postTag.tag.slug}`}
              >
                <Badge variant="secondary" className="text-xs">
                  #{postTag.tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Author & Meta */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <Link href={`/${post.author.username}`} className="flex items-center gap-3 group/author">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium group-hover/author:text-primary transition-colors">
                {post.author.name || post.author.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.publishedAt || post.createdAt)}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime}m
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {post.likeCount}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
