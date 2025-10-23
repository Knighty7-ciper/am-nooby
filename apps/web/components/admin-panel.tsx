'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  FileText, 
  MessageCircle,
  Flag,
  Settings,
  TrendingUp,
  Database,
  Mail,
  Search,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  UserCog,
  PlayCircle,
  Plus
} from 'lucide-react'
import Link from 'next/link'

type Tab = 'overview' | 'users' | 'posts' | 'comments' | 'guides' | 'reports' | 'settings'

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [users, setUsers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [guides, setGuides] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showGuideForm, setShowGuideForm] = useState(false)
  const [editingGuide, setEditingGuide] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'overview') {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        setStats(data)
      } else if (activeTab === 'users') {
        const response = await fetch('/api/admin/users')
        const data = await response.json()
        setUsers(data)
      } else if (activeTab === 'posts') {
        const response = await fetch('/api/admin/posts')
        const data = await response.json()
        setPosts(data)
      } else if (activeTab === 'comments') {
        const response = await fetch('/api/admin/comments')
        const data = await response.json()
        setComments(data)
      } else if (activeTab === 'guides') {
        const response = await fetch('/api/admin/guides')
        const data = await response.json()
        setGuides(data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'activate' | 'delete', role?: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, role }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Failed to perform action:', error)
    }
  }

  const handlePostAction = async (postId: string, action: 'publish' | 'unpublish' | 'feature' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Failed to perform action:', error)
    }
  }

  const handleCommentAction = async (commentId: string, action: 'approve' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Failed to perform action:', error)
    }
  }

  const handleGuideSubmit = async (formData: any) => {
    try {
      const url = editingGuide 
        ? `/api/admin/guides/${editingGuide.id}`
        : '/api/admin/guides'
      const method = editingGuide ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setShowGuideForm(false)
        setEditingGuide(null)
        loadData()
      }
    } catch (error) {
      console.error('Failed to save guide:', error)
    }
  }

  const handleGuideDelete = async (guideId: string) => {
    if (!confirm('Are you sure you want to delete this guide?')) return
    
    try {
      const response = await fetch(`/api/admin/guides/${guideId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Failed to delete guide:', error)
    }
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: TrendingUp },
    { id: 'users' as Tab, label: 'Users', icon: Users },
    { id: 'posts' as Tab, label: 'Posts', icon: FileText },
    { id: 'comments' as Tab, label: 'Comments', icon: MessageCircle },
    { id: 'guides' as Tab, label: 'Guides', icon: PlayCircle },
    { id: 'reports' as Tab, label: 'Reports', icon: Flag },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ]

  const roleColors = {
    ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    EDITOR: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    AUTHOR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    READER: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  }

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    SUSPENDED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    BANNED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Platform administration and management
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Card className="p-2">
            <div className="flex items-center gap-2 flex-wrap">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading...</p>
          </Card>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="font-semibold">Total Users</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      +{stats?.newUsersToday || 0} today
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <FileText className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="font-semibold">Total Posts</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats?.totalPosts || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {stats?.publishedPosts || 0} published
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-purple-500" />
                      </div>
                      <h3 className="font-semibold">Comments</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats?.totalComments || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {stats?.pendingComments || 0} pending review
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Mail className="w-5 h-5 text-orange-500" />
                      </div>
                      <h3 className="font-semibold">Subscribers</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats?.totalSubscribers || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {stats?.activeSubscribers || 0} active
                    </p>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {stats?.recentActivity?.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <p className="text-sm">{activity.message}</p>
                        <span className="text-xs text-gray-500 ml-auto">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {/* Search */}
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>
                </Card>

                {/* Users List */}
                <div className="space-y-3">
                  {users
                    .filter(user => 
                      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(user => (
                      <Card key={user.id} className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name ?? 'User'}`}
                            alt={user.name ?? 'User'}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">{user.name ?? user.username}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                                  {user.role}
                                </Badge>
                                <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                                  {user.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <span>{user.postCount || 0} posts</span>
                              <span>{user.followerCount || 0} followers</span>
                              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={user.role}
                                onChange={(e) => handleUserAction(user.id, 'activate', e.target.value)}
                                className="text-sm bg-transparent border rounded px-2 py-1"
                              >
                                <option value="READER">Reader</option>
                                <option value="AUTHOR">Author</option>
                                <option value="EDITOR">Editor</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                              {user.status === 'ACTIVE' ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUserAction(user.id, 'suspend')}
                                  >
                                    <Ban className="w-4 h-4 mr-1" />
                                    Suspend
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUserAction(user.id, 'ban')}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Ban
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Activate
                                </Button>
                              )}
                              <Link href={`/${user.username}`}>
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-3">
                {posts.map(post => (
                  <Card key={post.id} className="p-6">
                    <div className="flex items-start gap-4">
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{post.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{post.viewCount} views</span>
                            <span>{post.likeCount} likes</span>
                            <span>{post.commentCount} comments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {post.status !== 'PUBLISHED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePostAction(post.id, 'publish')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Publish
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePostAction(post.id, 'feature')}
                            >
                              Feature
                            </Button>
                            <Link href={`/post/${post.slug}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePostAction(post.id, 'delete')}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-3">
                {comments.map(comment => (
                  <Card key={comment.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.name ?? 'User'}`}
                        alt={comment.user?.name ?? 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{comment.user?.name ?? comment.user?.username}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              on <Link href={`/post/${comment.post?.slug}`} className="text-primary hover:underline">{comment.post?.title}</Link>
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCommentAction(comment.id, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCommentAction(comment.id, 'delete')}
                          >
                            <Trash2 className="w-4 h-4 mr-1 text-red-500" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <Card className="p-12 text-center">
                <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reports</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All clear! No content has been reported.
                </p>
              </Card>
            )}


            {/* Guides Tab */}
            {activeTab === 'guides' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Video Guides Management</h2>
                    <Button 
                      onClick={() => {
                        setEditingGuide(null)
                        setShowGuideForm(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Guide
                    </Button>
                  </div>

                  {/* Guide Form */}
                  {showGuideForm && (
                    <Card className="p-6 mb-6 bg-gray-50">
                      <h3 className="text-lg font-bold mb-4">
                        {editingGuide ? 'Edit Guide' : 'Create New Guide'}
                      </h3>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleGuideSubmit({
                          title: formData.get('title'),
                          description: formData.get('description'),
                          videoUrl: formData.get('videoUrl'),
                          thumbnail: formData.get('thumbnail'),
                          duration: formData.get('duration'),
                          level: formData.get('level'),
                          published: formData.get('published') === 'on',
                        })
                      }}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <input
                              name="title"
                              type="text"
                              required
                              defaultValue={editingGuide?.title}
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="Getting Started with NoobBlog"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Duration</label>
                            <input
                              name="duration"
                              type="text"
                              required
                              defaultValue={editingGuide?.duration}
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="10 min"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <textarea
                            name="description"
                            required
                            defaultValue={editingGuide?.description}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={3}
                            placeholder="A comprehensive guide to..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Video URL (YouTube, Vimeo, etc.)</label>
                            <input
                              name="videoUrl"
                              type="url"
                              required
                              defaultValue={editingGuide?.videoUrl}
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="https://youtube.com/watch?v=..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                            <input
                              name="thumbnail"
                              type="url"
                              required
                              defaultValue={editingGuide?.thumbnail}
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Level</label>
                            <select
                              name="level"
                              required
                              defaultValue={editingGuide?.level || 'BEGINNER'}
                              className="w-full px-3 py-2 border rounded-lg"
                            >
                              <option value="BEGINNER">Beginner</option>
                              <option value="INTERMEDIATE">Intermediate</option>
                              <option value="ADVANCED">Advanced</option>
                            </select>
                          </div>
                          <div className="flex items-center">
                            <label className="flex items-center gap-2">
                              <input
                                name="published"
                                type="checkbox"
                                defaultChecked={editingGuide?.published ?? true}
                                className="w-4 h-4"
                              />
                              <span className="text-sm font-medium">Publish immediately</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">
                            {editingGuide ? 'Update Guide' : 'Create Guide'}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setShowGuideForm(false)
                              setEditingGuide(null)
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Card>
                  )}

                  {/* Guides List */}
                  <div className="space-y-4">
                    {guides.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <PlayCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No guides yet. Click "Add New Guide" to create one.</p>
                      </div>
                    ) : (
                      guides.map((guide: any) => (
                        <Card key={guide.id} className="p-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={guide.thumbnail}
                              alt={guide.title}
                              className="w-32 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-lg">{guide.title}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Badge className={
                                      guide.level === 'BEGINNER' ? 'bg-green-500' :
                                      guide.level === 'INTERMEDIATE' ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }>
                                      {guide.level}
                                    </Badge>
                                    <span className="text-sm text-gray-500">{guide.duration}</span>
                                    <Badge variant={guide.published ? 'default' : 'secondary'}>
                                      {guide.published ? 'Published' : 'Draft'}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingGuide(guide)
                                      setShowGuideForm(true)
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleGuideDelete(guide.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Platform Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Name</label>
                      <input
                        type="text"
                        defaultValue="Blog Platform"
                        className="w-full bg-transparent border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Description</label>
                      <textarea
                        defaultValue="A modern blogging platform for creators"
                        rows={3}
                        className="w-full bg-transparent border rounded-lg p-2"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="allow-registration" className="w-4 h-4" defaultChecked />
                      <label htmlFor="allow-registration" className="text-sm">Allow new user registration</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="require-approval" className="w-4 h-4" />
                      <label htmlFor="require-approval" className="text-sm">Require admin approval for posts</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="enable-comments" className="w-4 h-4" defaultChecked />
                      <label htmlFor="enable-comments" className="text-sm">Enable comments globally</label>
                    </div>
                    <Button className="mt-4">
                      <Settings className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
