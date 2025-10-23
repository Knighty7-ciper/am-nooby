import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Zap, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Up to 10 posts per month',
        'Basic analytics',
        'Community support',
        'Standard editor',
        'Public posts only',
        'NoobBlog branding',
      ],
      cta: 'Get Started',
      href: '/handler/signup',
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'For serious writers',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        'Unlimited posts',
        'Advanced analytics',
        'Priority support',
        'Rich text editor',
        'Premium content support',
        'Custom domain',
        'Remove branding',
        'Newsletter integration',
        'SEO tools',
      ],
      cta: 'Start Pro Trial',
      href: '/handler/signup?plan=pro',
    },
    {
      name: 'Team',
      price: '$49',
      period: '/month',
      description: 'For teams and organizations',
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Team analytics',
        'Dedicated support',
        'Advanced SEO tools',
        'API access',
        'Custom branding',
        'Priority publishing',
        'Content approval workflow',
      ],
      cta: 'Contact Sales',
      href: '/contact',
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
      answer: 'We accept all major credit cards and PayPal.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No questions asked.',
    },
  ]

  return (
    <div className="container max-w-7xl py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <Badge className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Simple Pricing
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Start free, upgrade when you're ready. All plans include a 14-day trial.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <Card
              key={plan.name}
              className={`relative p-8 ${plan.popular ? 'border-primary border-2 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className={`p-3 bg-gradient-to-br ${plan.color} rounded-lg inline-block mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <Button
                className="w-full mb-6"
                variant={plan.popular ? 'default' : 'outline'}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

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
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-6">
              <h3 className="font-bold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-background mt-16">
        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Our team is here to help. Contact us for a personalized demo.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </Card>
    </div>
  )
}
