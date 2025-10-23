import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, Eye, Cookie, Database, Bell } from 'lucide-react'

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Account information (email, username, profile details)',
        'Content you create (posts, comments, drafts)',
        'Usage data (page views, interactions, preferences)',
        'Device and browser information',
        'Cookies and similar tracking technologies',
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To provide and improve our services',
        'To personalize your experience',
        'To send you important updates and notifications',
        'To analyze platform usage and trends',
        'To prevent fraud and ensure security',
        'To comply with legal obligations',
      ],
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: [
        'Industry-standard encryption for data in transit',
        'Secure data centers with physical security',
        'Regular security audits and updates',
        'Limited access to personal information',
        'Two-factor authentication available',
        'Regular backups and disaster recovery plans',
      ],
    },
    {
      icon: Cookie,
      title: 'Cookies and Tracking',
      content: [
        'Essential cookies for site functionality',
        'Analytics cookies to understand usage',
        'Preference cookies to remember your settings',
        'Third-party cookies for social features',
        'You can control cookies in your browser',
      ],
    },
    {
      icon: Bell,
      title: 'Your Rights',
      content: [
        'Access your personal data',
        'Request data correction or deletion',
        'Export your content and data',
        'Opt-out of marketing communications',
        'Control your privacy settings',
        'Lodge a complaint with supervisory authorities',
      ],
    },
  ]

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="mb-12">
        <Badge className="mb-4">
          <Shield className="w-3 h-3 mr-1" />
          Privacy Policy
        </Badge>
        <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: October 23, 2025
        </p>
      </div>

      {/* Introduction */}
      <Card className="p-8 mb-8">
        <p className="text-lg leading-relaxed">
          At NoobBlog, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you use our platform. Please read this 
          privacy policy carefully. If you do not agree with the terms of this privacy policy, please 
          do not access the site.
        </p>
      </Card>

      {/* Sections */}
      <div className="space-y-8 mb-12">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <Card className="p-6">
                <ul className="space-y-3">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Data Sharing */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span><strong>Service Providers:</strong> With trusted third parties who assist us in operating our platform</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span><strong>Legal Requirements:</strong> When required by law or to protect our rights</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Children's Privacy */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
        <Card className="p-6">
          <p className="text-muted-foreground">
            Our platform is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you are a parent or guardian and believe your 
            child has provided us with personal information, please contact us.
          </p>
        </Card>
      </div>

      {/* International Users */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">International Users</h2>
        <Card className="p-6">
          <p className="text-muted-foreground">
            If you are accessing NoobBlog from outside the United States, please be aware that your 
            information may be transferred to, stored, and processed in the United States. By using our 
            platform, you consent to the transfer of your information to the United States.
          </p>
        </Card>
      </div>

      {/* Changes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
        <Card className="p-6">
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page and updating the "Last updated" date. You are 
            advised to review this Privacy Policy periodically for any changes.
          </p>
        </Card>
      </div>

      {/* Contact */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 to-background">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="text-muted-foreground mb-4">
          If you have questions or concerns about this Privacy Policy, please contact us:
        </p>
        <ul className="space-y-2 text-muted-foreground">
          <li><strong>Email:</strong> privacy@noobblog.com</li>
          <li><strong>Address:</strong> 123 Creator Street, San Francisco, CA 94105</li>
        </ul>
      </Card>
    </div>
  )
}
