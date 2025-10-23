import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@noobblog/database'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function GuidesPage() {
  const guides = await prisma.guide.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-500'
      case 'INTERMEDIATE':
        return 'bg-yellow-500'
      case 'ADVANCED':
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
      {guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link key={guide.id} href={guide.videoUrl} target="_blank">
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
      ) : (
        <Card className="p-12 text-center">
          <PlayCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">No Guides Yet</h3>
          <p className="text-muted-foreground">
            Check back soon! We're working on creating helpful video guides for you.
          </p>
        </Card>
      )}

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
