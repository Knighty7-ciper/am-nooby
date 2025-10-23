import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'
import { StackProvider } from '@/components/stack-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://noobblog.netlify.app'),
  title: 'NoobBlog - Professional Blogging Platform',
  description: 'Write, share, and grow your audience with NoobBlog - a modern blogging platform built for creators.',
  keywords: ['blog', 'writing', 'content', 'publishing', 'creators'],
  authors: [{ name: 'NoobBlog Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://noobblog.vercel.app',
    siteName: 'NoobBlog',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@noobblog',
    creator: '@noobblog',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </StackProvider>
      </body>
    </html>
  )
}
