'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Payment Button Component
function SubscribeButton({ plan }: { plan: any }) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (plan.name !== 'Pro') {
      // For Free plan, just redirect to signup
      window.location.href = plan.href
      return
    }

    // For Pro plan, initiate payment
    setLoading(true)
    try {
      const response = await fetch('/api/subscribe', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const data = await response.json()
      
      if (data.paymentUrl) {
        // Redirect to PesaPal payment page
        window.location.href = data.paymentUrl
      } else if (data.error) {
        alert(data.error)
        setLoading(false)
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to start payment. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Button
      className="w-full mb-6"
      variant={plan.popular ? 'default' : 'outline'}
      onClick={handleSubscribe}
      disabled={loading}
    >
      {loading ? 'Processing...' : plan.cta}
    </Button>
  )
}

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Up to 10 posts per month',
        'Basic analytics dashboard',
        'Community support',
        'Standard rich text editor',
        'Public posts',
        'Comment on other posts',
        'Follow other writers',
        'Basic profile customization',
      ],
      cta: 'Get Started Free',
      href: '/handler/signup',
    },
    {
      name: 'Pro',
      price: 'KSh 150',
      period: '/month',
      description: 'For serious writers and creators',
      icon: Zap,
      color: 'from-primary to-primary-700',
      popular: true,
      features: [
        'Unlimited posts',
        'Advanced analytics & insights',
        'Priority support',
        'Advanced rich text editor',
        'Series & collections',
        'Custom profile themes',
        'Remove NoobBlog branding',
        'Post scheduling',
        'Draft sharing',
        'Featured author badge',
        'Export your content',
        'Advanced SEO tools',
      ],
      cta: 'Upgrade to Pro',
      href: '/handler/signup?plan=pro',
    },
  ]

  const faqs = [
    {
      question: 'Can I switch plans later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee on all paid plans.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods through PesaPal including M-Pesa, cards, and bank transfers.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No questions asked.',
    },
  ]

  return (
    <div className="container max-w-7xl py-6 sm:py-8 px-4 sm:px-6">
      {/* Hero with Image */}
      <div className="relative mb-12 sm:mb-16 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-orange-lg">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-95"
          style={{
            backgroundImage: "url('/images/aesthetic/wp14048942-writer-aesthetic-wallpapers.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        <div className="relative z-10 text-center px-6 py-16 sm:px-8 sm:py-20 md:py-24">
          <Badge className="mb-4 bg-white/10 backdrop-blur-sm border-white/20 text-white text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            Simple Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white leading-tight">
            Choose Your Plan
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto px-4">
            Start free, upgrade when you're ready. All plans include a 14-day trial.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <Card
              key={plan.name}
              className={`relative p-6 sm:p-8 ${plan.popular ? 'border-primary border-2 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className={`p-3 bg-gradient-to-br ${plan.color} rounded-lg inline-block mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                <span className="text-sm sm:text-base text-muted-foreground">{plan.period}</span>
              </div>

              <SubscribeButton plan={plan} />

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4 sm:space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-4 sm:p-6">
              <h3 className="font-bold mb-2 text-sm sm:text-base">{faq.question}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-primary/10 to-background mt-12 sm:mt-16 mx-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Still have questions?</h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
          Our team is here to help. Contact us for a personalized demo.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </Card>
    </div>
  )
}
