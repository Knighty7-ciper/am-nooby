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
    <Card className="group overflow-hidden border-2 border-neutral-200 hover:border-primary shadow-orange-sm hover:shadow-orange-lg transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] rounded-2xl">
      {/* Cover Image */}
      {post.coverImage && (
        <Link href={`/post/${post.slug}`} className="block relative h-56 overflow-hidden">
          <Image
            src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {featured && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-primary to-primary-700 text-white font-semibold px-3 py-1 shadow-orange-md">✨ Featured</Badge>
            </div>
          )}
        </Link>
      )}

      <div className="p-6">
        {/* Category */}
        {post.category && (
          <Link 
            href={`/category/${post.category.slug}`}
            className="inline-block text-sm font-bold text-primary hover:text-primary-700 transition-colors"
          >
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <Link href={`/post/${post.slug}`}>
          <h3 className="mt-3 text-2xl font-bold line-clamp-2 text-neutral-900 group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-3 text-neutral-700 text-base line-clamp-3 leading-relaxed">
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
                <Badge variant="secondary" className="text-xs font-medium px-3 py-1 hover:bg-primary-100 hover:text-primary-700 transition-colors">
                  #{postTag.tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Author & Meta */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t-2 border-neutral-200">
          <Link href={`/${post.author.username}`} className="flex items-center gap-3 group/author">
            <Avatar className="h-10 w-10 border-2 border-primary-100 group-hover/author:border-primary transition-colors">
              <AvatarImage src={post.author.avatar || undefined} />
              <AvatarFallback className="bg-primary-50 text-primary font-bold">{post.author.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold text-neutral-900 group-hover/author:text-primary transition-colors">
                {post.author.name || post.author.username}
              </p>
              <p className="text-xs text-neutral-600 font-medium">
                {formatDate(post.publishedAt || post.createdAt)}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-neutral-600 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              {post.readingTime}m
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-primary" />
              {post.likeCount}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
