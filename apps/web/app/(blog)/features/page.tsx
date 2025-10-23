import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Palette,
  Search,
  Rocket,
  MessageCircle,
  Heart,
  Share2,
  Lock,
  Globe,
  TrendingUp,
  Award,
  Code
} from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with Next.js 14 and optimized for speed. Your content loads instantly.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Palette,
      title: 'Beautiful Editor',
      description: 'Rich text editor with markdown support, code syntax highlighting, and image uploads.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Users,
      title: 'Social Features',
      description: 'Follow writers, engage with comments, likes, and bookmarks. Build your community.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track views, engagement, and understand your audience with detailed insights.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find content instantly with full-text search across posts, users, and tags.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Shield,
      title: 'SEO Optimized',
      description: 'Built-in SEO tools, meta tags, sitemaps, and RSS feeds to grow your audience.',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: MessageCircle,
      title: 'Comment System',
      description: 'Nested comments with replies, likes, and real-time updates.',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Trending Algorithm',
      description: 'Smart algorithm surfaces the best content based on engagement and recency.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Support for multiple languages and international content.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      icon: Lock,
      title: 'Premium Content',
      description: 'Monetize with premium posts and subscription tiers.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: Share2,
      title: 'Social Sharing',
      description: 'One-click sharing to Twitter, LinkedIn, and other platforms.',
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'REST API, webhooks, and extensive documentation for integrations.',
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/10',
    },
  ]

  const highlights = [
    { label: 'Lightning Fast', value: 'SEO Ready', icon: Zap },
    { label: 'Rich Editor', value: 'Markdown+', icon: Sparkles },
    { label: 'Analytics', value: 'Real-time', icon: TrendingUp },
    { label: 'Support', value: '24/7', icon: Rocket },
  ]

  return (
    <div className="container max-w-7xl py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <Badge className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Platform Features
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Everything You Need
          <br />
          To Create & Grow
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          NoobBlog is packed with powerful features to help you write, publish, and grow your audience.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/handler/signup">Get Started Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {highlights.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-6 text-center">
            <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bgColor }) => (
            <Card key={title} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className={`p-3 ${bgColor} rounded-lg inline-block mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-background">
        <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-4">Ready to Start Writing?</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of writers already creating amazing content on NoobBlog.
        </p>
        <Button size="lg" asChild>
          <Link href="/handler/signup">
            <Rocket className="w-4 h-4 mr-2" />
            Get Started Now
          </Link>
        </Button>
      </Card>
    </div>
  )
}
