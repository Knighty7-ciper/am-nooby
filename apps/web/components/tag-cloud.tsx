import Link from 'next/link'
import { Badge } from './ui/badge'

interface TagCloudProps {
  tags: any[]
}

export function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) return null

  // Calculate font sizes based on post count
  const maxCount = Math.max(...tags.map(t => t.postCount))
  const minCount = Math.min(...tags.map(t => t.postCount))
  
  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 'text-base'
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio > 0.7) return 'text-2xl'
    if (ratio > 0.4) return 'text-xl'
    if (ratio > 0.2) return 'text-lg'
    return 'text-base'
  }

  const getOpacity = (count: number) => {
    if (maxCount === minCount) return 'opacity-100'
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio > 0.7) return 'opacity-100'
    if (ratio > 0.4) return 'opacity-80'
    return 'opacity-60'
  }

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background rounded-lg border">
      {tags.map(tag => (
        <Link key={tag.id} href={`/tag/${tag.slug}`}>
          <span
            className={`${getFontSize(tag.postCount)} ${getOpacity(tag.postCount)} font-semibold hover:text-primary transition-all hover:scale-110 inline-block cursor-pointer`}
          >
            #{tag.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
