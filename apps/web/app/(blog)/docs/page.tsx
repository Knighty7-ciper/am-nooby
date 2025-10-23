import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, Code, Video, Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics and create your first post',
      icon: Lightbulb,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      items: [
        { title: 'Quick Start Guide', href: '#' },
        { title: 'Creating Your Profile', href: '#' },
        { title: 'Writing Your First Post', href: '#' },
        { title: 'Understanding Categories & Tags', href: '#' },
      ],
    },
    {
      title: 'Writing & Publishing',
      description: 'Master the editor and publishing workflow',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      items: [
        { title: 'Using the Rich Text Editor', href: '#' },
        { title: 'Markdown Syntax Guide', href: '#' },
        { title: 'Adding Images and Media', href: '#' },
        { title: 'SEO Best Practices', href: '#' },
        { title: 'Scheduling Posts', href: '#' },
      ],
    },
    {
      title: 'Growing Your Audience',
      description: 'Tips for engagement and community building',
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      items: [
        { title: 'Building Your Following', href: '#' },
        { title: 'Engaging with Comments', href: '#' },
        { title: 'Using Analytics', href: '#' },
        { title: 'Newsletter Integration', href: '#' },
      ],
    },
    {
      title: 'API & Integration',
      description: 'Connect NoobBlog with your tools',
      icon: Code,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      items: [
        { title: 'API Documentation', href: '#' },
        { title: 'Authentication', href: '#' },
        { title: 'Webhooks', href: '#' },
        { title: 'Code Examples', href: '#' },
      ],
    },
  ]

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge className="mb-4">
          <BookOpen className="w-3 h-3 mr-1" />
          Documentation
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Learn NoobBlog
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to know to make the most of NoobBlog.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
        <Link href="/guides">
          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <Video className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-bold">Video Guides</h3>
          </Card>
        </Link>
        <Link href="#api">
          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <Code className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-bold">API Docs</h3>
          </Card>
        </Link>
        <Link href="#faq">
          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <Lightbulb className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-bold">FAQ</h3>
          </Card>
        </Link>
        <Link href="/contact">
          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <FileText className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-bold">Support</h3>
          </Card>
        </Link>
      </div>

      {/* Documentation Sections */}
      <div className="space-y-8">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title} className="p-8">
              <div className="flex items-start gap-6">
                <div className={`p-4 ${section.bgColor} rounded-lg flex-shrink-0`}>
                  <Icon className={`w-8 h-8 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground mb-6">{section.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.items.map((item) => (
                      <Link key={item.title} href={item.href}>
                        <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition group">
                          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* CTA */}
      <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-background mt-16">
        <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Our support team is ready to help you.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </Card>
    </div>
  )
}
