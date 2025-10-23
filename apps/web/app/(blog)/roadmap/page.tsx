import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Clock, AlertCircle, Rocket, Code, Users, Zap } from 'lucide-react'

export default function RoadmapPage() {
  const roadmap = [
    {
      quarter: 'Q1 2025',
      status: 'completed',
      items: [
        { title: 'Core Platform Launch', description: 'Initial release with basic features', done: true },
        { title: 'User Authentication', description: 'Secure login and registration', done: true },
        { title: 'Rich Text Editor', description: 'Markdown and WYSIWYG support', done: true },
        { title: 'Comment System', description: 'Nested comments with replies', done: true },
      ],
    },
    {
      quarter: 'Q2 2025',
      status: 'in-progress',
      items: [
        { title: 'Advanced Analytics', description: 'Detailed insights and metrics', done: true },
        { title: 'Newsletter Integration', description: 'Email subscriptions and campaigns', done: true },
        { title: 'Premium Content', description: 'Paid subscriptions and memberships', done: false },
        { title: 'Mobile Apps', description: 'iOS and Android applications', done: false },
      ],
    },
    {
      quarter: 'Q3 2025',
      status: 'planned',
      items: [
        { title: 'API v2', description: 'RESTful API for integrations', done: false },
        { title: 'Webhooks', description: 'Real-time event notifications', done: false },
        { title: 'Advanced SEO Tools', description: 'Schema markup and optimization', done: false },
        { title: 'Team Collaboration', description: 'Multi-author workflows', done: false },
      ],
    },
    {
      quarter: 'Q4 2025',
      status: 'planned',
      items: [
        { title: 'AI Writing Assistant', description: 'AI-powered content suggestions', done: false },
        { title: 'Video Content', description: 'Video embedding and hosting', done: false },
        { title: 'Podcast Integration', description: 'Audio content support', done: false },
        { title: 'Advanced Monetization', description: 'Tips, donations, and sponsorships', done: false },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" /> Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" /> In Progress</Badge>
      case 'planned':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" /> Planned</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge className="mb-4">
          <Rocket className="w-3 h-3 mr-1" />
          Product Roadmap
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Building The Future
          <br />
          Together
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Here's what we're working on. Have a feature request? Let us know!
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-8 mb-16">
        {roadmap.map((quarter, index) => (
          <div key={quarter.quarter} className="relative">
            {/* Timeline line */}
            {index !== roadmap.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
            )}

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{quarter.quarter}</h2>
                </div>
                {getStatusBadge(quarter.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-16">
                {quarter.items.map((item) => (
                  <div
                    key={item.title}
                    className={`p-4 border rounded-lg ${item.done ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/30'}`}
                  >
                    <div className="flex items-start gap-3">
                      {item.done ? (
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 mt-0.5 border-2 rounded-full" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Feature Requests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="p-6 text-center">
          <Code className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="font-bold mb-2">API First</h3>
          <p className="text-sm text-muted-foreground">
            Everything we build comes with a robust API
          </p>
        </Card>
        <Card className="p-6 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="font-bold mb-2">Community Driven</h3>
          <p className="text-sm text-muted-foreground">
            Your feedback shapes our roadmap
          </p>
        </Card>
        <Card className="p-6 text-center">
          <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="font-bold mb-2">Ship Fast</h3>
          <p className="text-sm text-muted-foreground">
            We release new features every week
          </p>
        </Card>
      </div>

      {/* CTA */}
      <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-background">
        <h2 className="text-3xl font-bold mb-4">Want to shape the future?</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join our community and help us build the features you need.
        </p>
        <div className="flex gap-4 justify-center">
          <Badge variant="outline" className="px-4 py-2">Vote on features</Badge>
          <Badge variant="outline" className="px-4 py-2">Request features</Badge>
          <Badge variant="outline" className="px-4 py-2">Join Discord</Badge>
        </div>
      </Card>
    </div>
  )
}
