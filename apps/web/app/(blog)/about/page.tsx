import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Sparkles, Target, Users, Heart, Code, Globe } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@noobblog/database'

export const revalidate = 60 // Revalidate every 60 seconds

async function getRealtimeStats() {
  const [totalAuthors, totalPosts, totalUsers] = await Promise.all([
    prisma.user.count({
      where: {
        role: { in: ['AUTHOR', 'EDITOR', 'ADMIN'] },
        postCount: { gt: 0 },
      },
    }),
    prisma.post.count({
      where: { status: 'PUBLISHED' },
    }),
    prisma.user.count(),
  ])
  
  return {
    authors: totalAuthors,
    posts: totalPosts,
    users: totalUsers,
  }
}

export default async function AboutPage() {
  const stats = await getRealtimeStats()
  
  const team = [
    {
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      bio: '10+ years in content platforms',
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Product',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Former Product Manager at Medium',
    },
    {
      name: 'Marcus Williams',
      role: 'Lead Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      bio: 'Full-stack wizard',
    },
    {
      name: 'Emma Davis',
      role: 'Head of Community',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      bio: 'Building writer communities',
    },
  ]

  const values = [
    {
      icon: Sparkles,
      title: 'Quality First',
      description: 'We prioritize quality content and meaningful engagement over vanity metrics.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Our platform is shaped by feedback from writers and readers.',
    },
    {
      icon: Heart,
      title: 'Creator Focused',
      description: 'Every feature we build is designed to empower creators.',
    },
    {
      icon: Code,
      title: 'Open & Transparent',
      description: 'We believe in building in public and being transparent with our community.',
    },
  ]

  const displayStats = [
    { label: 'Active Writers', value: stats.authors },
    { label: 'Posts Published', value: stats.posts },
    { label: 'Community Members', value: stats.users },
    { label: 'Countries', value: '120+' },
  ]

  return (
    <div className="container max-w-7xl py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <Badge className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          About Us
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Empowering Writers
          <br />
          Everywhere
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          NoobBlog was born from a simple idea: every writer deserves a platform that puts them first.
        </p>
      </div>

      {/* Mission */}
      <Card className="p-12 mb-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-primary rounded-lg flex-shrink-0">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              We're building the best platform for writers to create, publish, and grow their audience. 
              No algorithms hiding your content, no paywalls limiting your reach, no complicated tools 
              getting in your way.
            </p>
            <p className="text-lg text-muted-foreground">
              Just a clean, powerful platform that lets you focus on what matters most: your writing.
            </p>
          </div>
        </div>
      </Card>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {displayStats.map((stat) => (
          <Card key={stat.label} className="p-6 text-center">
            <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <Card key={value.title} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet The Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card key={member.name} className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <img src={member.avatar} alt={member.name} />
              </Avatar>
              <h3 className="font-bold mb-1">{member.name}</h3>
              <p className="text-sm text-primary mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Join Us */}
      <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-background">
        <Globe className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Whether you're a seasoned writer or just starting out, NoobBlog is here to help you succeed.
        </p>
        <Button size="lg" asChild>
          <Link href="/handler/sign-up">Get Started Free</Link>
        </Button>
      </Card>
    </div>
  )
}
