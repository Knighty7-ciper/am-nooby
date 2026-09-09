'use client'

import { useState, useEffect } from 'react'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, Clock, Sparkles, Users } from 'lucide-react'

type FilterType = 'latest' | 'trending' | 'featured' | 'following'

export default function ExplorePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('latest')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  // Fetch posts
  const fetchPosts = async (currentPage: number, filter: FilterType, category: string | null = null) => {
    setLoading(true)
    try {
      let url = `/api/posts?page=${currentPage}&limit=12`
      
      if (category) url += `&category=${category}`
      
      // Add sorting based on filter
      if (filter === 'trending') url += '&sort=trending'
      if (filter === 'featured') url += '&featured=true'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (currentPage === 1) {
        setPosts(data.posts)
      } else {
        setPosts(prev => [...prev, ...data.posts])
      }
      
      setHasMore(data.pagination.page < data.pagination.pages)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
  }, [])

  // Initial fetch
  useEffect(() => {
    setPage(1)
    fetchPosts(1, activeFilter, selectedCategory)
  }, [activeFilter, selectedCategory])

  // Load more
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage, activeFilter, selectedCategory)
    }
  }

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore, page])

  const filterButtons = [
    { key: 'latest' as FilterType, label: 'Latest', icon: Clock },
    { key: 'trending' as FilterType, label: 'Trending', icon: TrendingUp },
    { key: 'featured' as FilterType, label: 'Featured', icon: Sparkles },
    { key: 'following' as FilterType, label: 'Following', icon: Users },
  ]

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Explore Posts
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover amazing content from our community
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Main Filters */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeFilter === key ? 'default' : 'outline'}
              onClick={() => setActiveFilter(key)}
              className="gap-2"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!selectedCategory ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Badge>
          {categories.slice(0, 8).map(category => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.slug ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedCategory(category.slug)}
              style={{
                backgroundColor: selectedCategory === category.slug ? category.color : undefined,
              }}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {loading && page === 1 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No posts found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More Indicator */}
          {loading && page > 1 && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              You've reached the end
            </div>
          )}
        </>
      )}
    </div>
  )
}
