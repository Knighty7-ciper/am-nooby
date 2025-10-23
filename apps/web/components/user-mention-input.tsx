'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface User {
  id: string
  username: string
  name: string | null
  avatar: string | null
}

interface UserMentionInputProps {
  value: string
  onChange: (value: string) => void
  onMention?: (user: User) => void
  placeholder?: string
  className?: string
}

export function UserMentionInput({
  value,
  onChange,
  onMention,
  placeholder = 'Write a comment... Type @ to mention users',
  className = '',
}: UserMentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (searchQuery) {
      // Fetch user suggestions
      fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
        .then(res => res.json())
        .then(users => {
          setSuggestions(users)
          setShowSuggestions(users.length > 0)
        })
        .catch(() => {
          setSuggestions([])
          setShowSuggestions(false)
        })
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Detect @ mentions
    const cursorPos = e.target.selectionStart
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const match = textBeforeCursor.match(/@(\w*)$/)

    if (match) {
      setSearchQuery(match[1])
      setSelectedIndex(0)
    } else {
      setSearchQuery('')
      setShowSuggestions(false)
    }
  }

  const insertMention = (user: User) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart
    const textBeforeCursor = value.slice(0, cursorPos)
    const textAfterCursor = value.slice(cursorPos)

    // Replace @query with @username
    const beforeMention = textBeforeCursor.replace(/@\w*$/, '')
    const newValue = `${beforeMention}@${user.username} ${textAfterCursor}`

    onChange(newValue)
    setShowSuggestions(false)
    setSearchQuery('')

    if (onMention) {
      onMention(user)
    }

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = beforeMention.length + user.username.length + 2
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' && showSuggestions) {
      e.preventDefault()
      insertMention(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full resize-none ${className}`}
      />

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full max-w-sm mt-1 p-2 shadow-lg">
          <div className="space-y-1">
            {suggestions.map((user, index) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors ${
                  index === selectedIndex ? 'bg-muted' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <img src={user.avatar || '/default-avatar.png'} alt={user.username} />
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{user.name || user.username}</div>
                  <div className="text-xs text-muted-foreground">@{user.username}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
