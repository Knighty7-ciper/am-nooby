'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Mail, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        toast.success('Successfully subscribed to newsletter!')
        setEmail('')
      } else {
        toast.error('Failed to subscribe. Please try again.')
      }
    } catch (error) {
      toast.error('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="relative p-10 md:p-16 text-center overflow-hidden border-2 border-primary/20 shadow-orange-lg rounded-3xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-primary-100/50 to-background -z-10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -z-10" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-700 mb-8 shadow-orange-md">
          <Mail className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4 leading-tight">
          Never Miss a Post
        </h2>
        
        <p className="text-lg text-neutral-700 mb-10 leading-relaxed">
          Get the latest posts and updates delivered directly to your inbox. Join our community of readers!
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-14 px-6 text-base border-2 border-neutral-300 focus:border-primary rounded-xl shadow-sm"
          />
          <Button 
            type="submit" 
            disabled={loading}
            size="lg"
            className="whitespace-nowrap"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
            <Send className="ml-2 h-5 w-5" />
          </Button>
        </form>
        
        <p className="text-sm text-neutral-600 mt-6 font-medium">
          🔒 We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </Card>
  )
}
