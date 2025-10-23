'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, MessageCircle, Send, MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement actual form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Failed to submit form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge className="mb-4">
          <MessageCircle className="w-3 h-3 mr-1" />
          Contact Us
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Get In Touch
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground mb-2">Our team is here to help</p>
                <a href="mailto:support@noobblog.com" className="text-sm text-primary hover:underline">
                  support@noobblog.com
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-2">Available Mon-Fri, 9am-5pm EST</p>
                <Button size="sm" variant="outline">Start Chat</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Office</h3>
                <p className="text-sm text-muted-foreground">
                  123 Creator Street<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-background">
            <h3 className="font-bold mb-2">Response Time</h3>
            <p className="text-sm text-muted-foreground mb-3">
              We typically respond within 24 hours during business days.
            </p>
            <Badge variant="secondary">Fast Support</Badge>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
