import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react'

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using NoobBlog, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.',
    },
    {
      title: '2. User Accounts',
      content: 'You are responsible for maintaining the security of your account and password. You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.',
    },
    {
      title: '3. Content Ownership',
      content: 'You retain all rights to the content you create and publish on NoobBlog. By publishing content, you grant us a non-exclusive, worldwide license to host, distribute, and display your content on our platform.',
    },
    {
      title: '4. Acceptable Use',
      content: 'You agree not to use NoobBlog for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services. You will not upload malicious code, spam, or engage in harassment.',
    },
    {
      title: '5. Content Guidelines',
      content: 'Published content must comply with our community guidelines. We reserve the right to remove content that violates these guidelines, including but not limited to illegal content, hate speech, harassment, or spam.',
    },
    {
      title: '6. Intellectual Property',
      content: 'The NoobBlog name, logo, and platform features are protected by copyright, trademark, and other laws. You may not use our intellectual property without prior written permission.',
    },
    {
      title: '7. Termination',
      content: 'We may terminate or suspend your account at any time for violations of these terms. Upon termination, your right to use NoobBlog will immediately cease. You may also delete your account at any time.',
    },
    {
      title: '8. Disclaimers',
      content: 'NoobBlog is provided "as is" without warranties of any kind. We do not guarantee that the platform will be error-free, secure, or uninterrupted. Use of the platform is at your own risk.',
    },
    {
      title: '9. Limitation of Liability',
      content: 'To the fullest extent permitted by law, NoobBlog shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.',
    },
    {
      title: '10. Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. We will notify users of any material changes. Continued use of NoobBlog after changes constitutes acceptance of the new terms.',
    },
  ]

  const prohibited = [
    'Illegal content or activities',
    'Hate speech or harassment',
    'Spam or unsolicited advertising',
    'Malware or malicious code',
    'Impersonation or fraud',
    'Copyright infringement',
    'Adult content (without proper age restrictions)',
    'Misinformation or fake news',
  ]

  const allowed = [
    'Original content creation',
    'Respectful discussion and debate',
    'Educational and informative content',
    'Creative writing and storytelling',
    'Professional networking',
    'Sharing knowledge and expertise',
  ]

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="mb-12">
        <Badge className="mb-4">
          <FileText className="w-3 h-3 mr-1" />
          Terms of Service
        </Badge>
        <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: October 23, 2025
        </p>
      </div>

      {/* Introduction */}
      <Card className="p-8 mb-12">
        <p className="text-lg leading-relaxed mb-4">
          Welcome to NoobBlog! These Terms of Service ("Terms") govern your use of the NoobBlog platform 
          and services. By using NoobBlog, you agree to these terms in full.
        </p>
        <p className="text-muted-foreground">
          Please read these terms carefully before using our platform. If you have any questions, 
          please contact us at legal@noobblog.com.
        </p>
      </Card>

      {/* Main Terms */}
      <div className="space-y-6 mb-12">
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-bold mb-3">{section.title}</h2>
            <Card className="p-6">
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </Card>
          </div>
        ))}
      </div>

      {/* Prohibited vs Allowed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold">Prohibited Activities</h2>
          </div>
          <Card className="p-6">
            <ul className="space-y-3">
              {prohibited.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold">Encouraged Activities</h2>
          </div>
          <Card className="p-6">
            <ul className="space-y-3">
              {allowed.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Dispute Resolution */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Dispute Resolution</h2>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Any disputes arising from these terms or your use of NoobBlog shall be resolved through:
          </p>
          <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
            <li>Good faith negotiation between parties</li>
            <li>Mediation if negotiation fails</li>
            <li>Binding arbitration in San Francisco, California</li>
          </ol>
        </Card>
      </div>

      {/* Governing Law */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
        <Card className="p-6">
          <p className="text-muted-foreground">
            These Terms shall be governed by and construed in accordance with the laws of the State of 
            California, United States, without regard to its conflict of law provisions.
          </p>
        </Card>
      </div>

      {/* Contact */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 to-background">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Email:</strong> legal@noobblog.com</li>
              <li><strong>Address:</strong> 123 Creator Street, San Francisco, CA 94105</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
