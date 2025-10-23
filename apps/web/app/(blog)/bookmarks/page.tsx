'use client'

import { useState, useEffect } from 'react'
import { PostCard } from '@/components/post-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Bookmark, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bookmarks')
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data.bookmarks || [])
      } else if (response.status === 401) {
        router.push('/handler/signin')
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = async (postId: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      if (response.ok) {
        setBookmarks(bookmarks.filter(b => b.postId !== postId))
      }
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-lg">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            My Bookmarks
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your saved posts in one place
        </p>
      </div>

      {/* Stats */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{bookmarks.length}</p>
            <p className="text-sm text-muted-foreground">Saved Posts</p>
          </div>
          <Bookmark className="w-12 h-12 text-primary/20" />
        </div>
      </Card>

      {/* Bookmarks Grid */}
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="relative group">
              <PostCard post={bookmark.post} />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                onClick={() => removeBookmark(bookmark.postId)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Bookmark className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-4">No bookmarks yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Start bookmarking posts to save them for later
          </p>
          <Button onClick={() => router.push('/explore')}>Explore Posts</Button>
        </Card>
      )}
    </div>
  )
}
