'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Sparkles, TrendingUp, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface UpgradeToProProps {
  reason?: string
  variant?: 'post-limit' | 'feature-locked' | 'default'
}

export function UpgradeToPro({ reason, variant = 'default' }: UpgradeToProProps) {
  const getMessage = () => {
    switch (variant) {
      case 'post-limit':
        return {
          title: "You've Reached Your Monthly Limit",
          subtitle: "Upgrade to Pro for unlimited posts and advanced features",
          icon: <TrendingUp className="w-12 h-12 text-primary" />,
        }
      case 'feature-locked':
        return {
          title: "This Feature is Pro-Only",
          subtitle: "Unlock advanced features and take your blog to the next level",
          icon: <Zap className="w-12 h-12 text-primary" />,
        }
      default:
        return {
          title: "Upgrade to Pro",
          subtitle: "Unlock unlimited posts and advanced features",
          icon: <Sparkles className="w-12 h-12 text-primary" />,
        }
    }
  }

  const message = getMessage()

  const proFeatures = [
    'Unlimited posts per month',
    'Post scheduling',
    'Advanced analytics',
    'Series & collections',
    'Premium content support',
    'Profile customization',
    'Content export',
    'Priority support',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section with Image */}
        <div className="relative mb-12 sm:mb-16 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-orange-lg">
          <div className="absolute inset-0">
            <Image
              src="/images/aesthetic/wp14049069-writer-aesthetic-wallpapers.jpg"
              alt="Writing aesthetic"
              fill
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          
          <div className="relative z-10 px-6 py-16 sm:px-8 sm:py-20 md:px-16 md:py-32">
            <div className="max-w-2xl">
              <div className="mb-6">{message.icon}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {message.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
                {message.subtitle}
              </p>
              {reason && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-8">
                  <p className="text-white/80">{reason}</p>
                </div>
              )}
              <Link href="/pricing">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-orange-md hover:shadow-orange-lg transition-all w-full sm:w-auto">
                  <Sparkles className="w-5 h-5 mr-2" />
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">What You'll Get with Pro</h2>
          <p className="text-center text-neutral-600 mb-8 sm:mb-12 text-base sm:text-lg px-4">Everything you need to grow your blog</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {proFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-orange-md transition-all duration-300 hover:-translate-y-1">
                <Check className="w-6 h-6 text-primary mb-3" />
                <p className="font-medium">{feature}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Section */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 border-2 border-neutral-200">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Free Plan</h3>
            <p className="text-4xl font-bold text-neutral-400 mb-6">Free<span className="text-lg font-normal">/month</span></p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-600">10 posts per month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-600">Basic analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-600">Community support</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-8 border-2 border-primary shadow-lg sm:shadow-orange-lg relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">Popular</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Pro Plan</h3>
            <p className="text-4xl font-bold text-primary mb-6">KSh 150<span className="text-lg font-normal">/month</span></p>
            <ul className="space-y-3 mb-8">
              {proFeatures.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
              <li className="text-sm text-neutral-600 pl-7">+ 4 more features...</li>
            </ul>
            <Link href="/pricing">
              <Button size="lg" className="w-full shadow-orange-md hover:shadow-orange-lg">
                Upgrade Now
              </Button>
            </Link>
          </Card>
        </div>

        {/* CTA with Image */}
        <div className="mt-12 sm:mt-16 relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-orange-lg">
          <div className="absolute inset-0">
            <Image
              src="/images/aesthetic/wp13154126-writing-aesthetic-wallpapers.jpg"
              alt="Start writing"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          </div>
          <div className="relative z-10 text-center py-12 sm:py-16 px-6 sm:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to Take Your Blog Further?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join hundreds of writers who've unlocked their full potential with Pro
            </p>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-0 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                See All Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
