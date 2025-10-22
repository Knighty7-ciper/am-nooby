import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-16">
      <h1 className="text-5xl font-bold mb-6">About NoobBlog</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-muted-foreground mb-8">
          NoobBlog is a professional blogging platform built for writers, readers, and communities.
        </p>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p>
              To provide a free, open, and powerful platform where anyone can share their stories,
              knowledge, and ideas with the world. No paywalls, no premium features locked away—
              everything you need to build your audience and create amazing content.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold mb-4">Why NoobBlog?</h2>
            <ul className="space-y-2">
              <li>✅ <strong>Completely Free</strong> - No subscriptions, no hidden costs</li>
              <li>✅ <strong>Rich Features</strong> - Everything premium platforms offer</li>
              <li>✅ <strong>Open Source</strong> - Built with transparency</li>
              <li>✅ <strong>Modern Tech</strong> - Fast, secure, and reliable</li>
              <li>✅ <strong>Community First</strong> - Built for writers and readers</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold mb-4">Get Started</h2>
            <p className="mb-4">
              Ready to start your blogging journey? Join our community of passionate writers
              and share your voice with the world.
            </p>
            <Link href="/sign-up">
              <Button size="lg">Join NoobBlog Today</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
