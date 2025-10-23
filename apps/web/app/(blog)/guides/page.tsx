import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Clock, Award } from 'lucide-react'
import Link from 'next/link'

export default function GuidesPage() {
  const guides = [
    {
      title: 'Getting Started with NoobBlog',
      description: 'Learn the basics of NoobBlog in just 10 minutes',
      duration: '10 min',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    },
    {
      title: 'Writing Your First Post',
      description: 'A step-by-step guide to creating engaging content',
      duration: '15 min',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    },
    {
      title: 'SEO Optimization Tips',
      description: 'Make your posts discoverable and rank higher',
      duration: '20 min',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800',
    },
    {
      title: 'Building Your Audience',
      description: 'Strategies to grow your follower base',
      duration: '25 min',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    },
    {
      title: 'Monetization Strategies',
      description: 'Turn your writing into a sustainable income',
      duration: '30 min',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    },
    {
      title: 'Advanced Analytics',
      description: 'Deep dive into metrics and data analysis',
      duration: '35 min',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500'
      case 'Intermediate':
        return 'bg-yellow-500'
      case 'Advanced':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge className="mb-4">
          <PlayCircle className="w-3 h-3 mr-1" />
          Video Guides
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Learn By Doing
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Step-by-step video guides to help you master every aspect of NoobBlog.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="p-6 text-center">
          <PlayCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
          <div className="text-3xl font-bold mb-1">{guides.length}</div>
          <div className="text-sm text-muted-foreground">Video Guides</div>
        </Card>
        <Card className="p-6 text-center">
          <Clock className="w-8 h-8 mx-auto mb-3 text-primary" />
          <div className="text-3xl font-bold mb-1">2+ Hours</div>
          <div className="text-sm text-muted-foreground">Of Content</div>
        </Card>
        <Card className="p-6 text-center">
          <Award className="w-8 h-8 mx-auto mb-3 text-primary" />
          <div className="text-3xl font-bold mb-1">Free</div>
          <div className="text-sm text-muted-foreground">For Everyone</div>
        </Card>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Link key={guide.title} href="#">
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="relative h-48">
                <img
                  src={guide.thumbnail}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
                <Badge className={`absolute top-3 right-3 ${getLevelColor(guide.level)}`}>
                  {guide.level}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{guide.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {guide.duration}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-background mt-16">
        <h2 className="text-3xl font-bold mb-4">Want more in-depth training?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Check out our comprehensive course for writers.
        </p>
        <Badge variant="outline" className="text-lg px-6 py-3">
          Coming Soon
        </Badge>
      </Card>
    </div>
  )
}
