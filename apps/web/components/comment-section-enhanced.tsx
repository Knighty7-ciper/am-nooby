'use client'

import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { UserMentionInput } from '@/components/user-mention-input'
import { Heart, MessageCircle, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    username: string
    avatar: string | null
  }
  replies?: Comment[]
}

interface CommentItemProps {
  comment: Comment
  onReply: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
  currentUserId?: string
}

function CommentItem({ comment, onReply, onDelete, currentUserId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReply = async () => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      await onReply(comment.id, replyContent)
      setReplyContent('')
      setIsReplying(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Parse @mentions in content and make them clickable
  const renderContentWithMentions = (content: string) => {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.slice(1)
        return (
          <a
            key={index}
            href={`/${username}`}
            className="text-primary hover:underline font-medium"
          >
            {part}
          </a>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <img src={comment.user.avatar || '/default-avatar.png'} alt={comment.user.name || comment.user.username} />
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">{comment.user.name || comment.user.username}</span>
              <a href={`/${comment.user.username}`} className="text-sm text-muted-foreground ml-2 hover:text-primary">
                @{comment.user.username}
              </a>
              <span className="text-sm text-muted-foreground ml-2">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            {currentUserId === comment.user.id && (
              <Button variant="ghost" size="sm" onClick={() => onDelete(comment.id)}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-sm">{renderContentWithMentions(comment.content)}</p>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>

          {isReplying && (
            <div className="space-y-2 pt-2">
              <UserMentionInput
                value={replyContent}
                onChange={setReplyContent}
                placeholder={`Reply to @${comment.user.username}... Type @ to mention users`}
                className="w-full border rounded-lg p-3 outline-none focus:border-primary resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply} disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 mt-4 space-y-4 border-l-2 pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  currentUserId?: string
}

export function CommentSectionEnhanced({ postId, comments, currentUserId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localComments, setLocalComments] = useState(comments)

  const handleSubmit = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: newComment }),
      })

      if (response.ok) {
        const { comment } = await response.json()
        setLocalComments([comment, ...localComments])
        setNewComment('')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId: string, content: string) => {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content, parentId }),
    })

    if (response.ok) {
      // Refresh comments
      window.location.reload()
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setLocalComments(localComments.filter(c => c.id !== commentId))
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comments ({localComments.length})</h2>
        
        {currentUserId ? (
          <div className="space-y-2">
            <UserMentionInput
              value={newComment}
              onChange={setNewComment}
              placeholder="Write a comment... Type @ to mention users"
              className="w-full border rounded-lg p-4 outline-none focus:border-primary resize-none min-h-[100px]"
            />
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        ) : (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground">Sign in to leave a comment</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {localComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onDelete={handleDelete}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  )
}
