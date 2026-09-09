'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/rich-text-editor'
import { 
  Save,
  Send, 
  Image as ImageIcon,
  Settings,
  X,
  Tag,
  FolderOpen,
  BookOpen
} from 'lucide-react'

interface PostEditorProps {
  postId?: string
}

type PostForm = {
  title: string
  excerpt: string
  content: string
  coverImage: string
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
  categoryId: string
  tags: string[]
  seriesId: string
  featured: boolean
  allowComments: boolean
  isPremium: boolean
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

const initialPost: PostForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  status: 'DRAFT',
  categoryId: '',
  tags: [],
  seriesId: '',
  featured: false,
  allowComments: true,
  isPremium: false,
  metaTitle: '',
  metaDescription: '',
  keywords: [],
}

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [post, setPost] = useState<PostForm>(initialPost)
  const [categories, setCategories] = useState<any[]>([])
  const [series, setSeries] = useState<any[]>([])

  useEffect(() => {
    const loadEditorData = async () => {
      try {
        const [categoriesResponse, seriesResponse, postResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/series'),
          postId ? fetch(`/api/posts/${postId}`) : Promise.resolve(null),
        ])
        const [categoriesData, seriesData] = await Promise.all([
          categoriesResponse.json(),
          seriesResponse.json(),
        ])

        setCategories(categoriesData.categories || [])
        setSeries(seriesData || [])

        if (postResponse?.ok) {
          const { post: existingPost } = await postResponse.json()
          setPost({ ...initialPost, ...existingPost, tags: existingPost.tags || [] })
        }
      } catch (error) {
        console.error('Failed to load editor data:', error)
      }
    }

    void loadEditorData()
  }, [postId])

  const handleSave = async (status: PostForm['status']) => {
    setIsSaving(true)
    try {
      const response = await fetch(postId ? `/api/posts/${postId}` : '/api/posts', {
        method: postId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, status }),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      const { post: savedPost } = await response.json()
      if (status === 'PUBLISHED') {
        router.push(`/post/${savedPost.slug}`)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setPost({ ...post, coverImage: data.url })
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {postId ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Reading time: ~{calculateReadingTime(post.content)} min
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave('PUBLISHED')}
            disabled={isSaving}
          >
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Image */}
          <Card className="p-6">
            <label className="block text-sm font-medium mb-4">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Cover Image
            </label>
            {post.coverImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={post.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPost({ ...post, coverImage: '' })}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center h-full">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">Click to upload cover image</p>
                </div>
              </label>
            )}
          </Card>

          {/* Title */}
          <Card className="p-6">
            <input
              type="text"
              placeholder="Post Title..."
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </Card>

          {/* Excerpt */}
          <Card className="p-6">
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              placeholder="Brief description of your post..."
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              rows={3}
              className="w-full bg-transparent border rounded-lg p-3 outline-none focus:border-primary resize-none"
            />
          </Card>

          {/* Content */}
          <Card className="p-6">
            <label className="block text-sm font-medium mb-4">Content</label>
            <RichTextEditor
              content={post.content}
              onChange={(content) => setPost({ ...post, content })}
              placeholder="Write your story... Use the toolbar to format your content, add images, and more!"
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <Card className="p-6">
            <label className="block text-sm font-medium mb-3">
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Category
            </label>
            <select
              value={post.categoryId}
              onChange={(e) => setPost({ ...post, categoryId: e.target.value })}
              className="w-full bg-transparent border rounded-lg p-2 outline-none focus:border-primary"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <label className="block text-sm font-medium mb-3">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="cursor-pointer">
                  {tag}
                  <X
                    className="w-3 h-3 ml-1"
                    onClick={() => setPost({
                      ...post,
                      tags: post.tags.filter((_, i) => i !== idx)
                    })}
                  />
                </Badge>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  e.preventDefault()
                  const newTag = e.currentTarget.value.trim()
                  if (!post.tags.includes(newTag)) {
                    setPost({ ...post, tags: [...post.tags, newTag] })
                  }
                  e.currentTarget.value = ''
                }
              }}
              className="w-full bg-transparent border rounded-lg p-2 outline-none focus:border-primary"
            />
          </Card>

          {/* Series */}
          <Card className="p-6">
            <label className="block text-sm font-medium mb-3">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Series
            </label>
            <select
              value={post.seriesId}
              onChange={(e) => setPost({ ...post, seriesId: e.target.value })}
              className="w-full bg-transparent border rounded-lg p-2 outline-none focus:border-primary"
            >
              <option value="">No series</option>
              {series.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Card>

          {/* Options */}
          <Card className="p-6">
            <label className="block text-sm font-medium mb-3">Options</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={post.featured}
                  onChange={(e) => setPost({ ...post, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Featured post</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={post.allowComments}
                  onChange={(e) => setPost({ ...post, allowComments: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Allow comments</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={post.isPremium}
                  onChange={(e) => setPost({ ...post, isPremium: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Premium content</span>
              </label>
            </div>
          </Card>

          {/* SEO Settings */}
          {showSettings && (
            <Card className="p-6">
              <label className="block text-sm font-medium mb-3">SEO Settings</label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Meta Title"
                  value={post.metaTitle}
                  onChange={(e) => setPost({ ...post, metaTitle: e.target.value })}
                  className="w-full bg-transparent border rounded-lg p-2 outline-none focus:border-primary text-sm"
                />
                <textarea
                  placeholder="Meta Description"
                  value={post.metaDescription}
                  onChange={(e) => setPost({ ...post, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border rounded-lg p-2 outline-none focus:border-primary resize-none text-sm"
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
