'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PostCard } from '@/components/post-card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search as SearchIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'users' | 'tags'>('all')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q, 'all')
    }
  }, [searchParams])

  const performSearch = async (searchQuery: string, type: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}`)
      const data = await response.json()
      setResults(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, activeTab)
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Search</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for posts, users, tags..."
            className="text-lg"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
          </Button>
        </form>

        <div className="flex gap-2">
          {(['all', 'posts', 'users', 'tags'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab(tab)
                if (query) performSearch(query, tab)
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {results && (
        <div className="space-y-8">
          {/* Posts Results */}
          {(activeTab === 'all' || activeTab === 'posts') && results.posts && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Posts ({results.posts.length})</h2>
              <div className="grid gap-6">
                {results.posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Users Results */}
          {(activeTab === 'all' || activeTab === 'users') && results.users && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Users ({results.users.length})</h2>
              <div className="grid gap-4">
                {results.users.map((user: any) => (
                  <Link key={user.id} href={`/@${user.username}`}>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <img src={user.avatar || '/default-avatar.png'} alt={user.name || user.username} />
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name || user.username}</h3>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags Results */}
          {(activeTab === 'all' || activeTab === 'tags') && results.tags && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Tags ({results.tags.length})</h2>
              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag: any) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <Badge variant="secondary" className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition">
                      #{tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {results && !results.posts?.length && !results.users?.length && !results.tags?.length && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
