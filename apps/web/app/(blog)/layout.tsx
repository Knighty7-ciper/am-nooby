import { Suspense } from 'react'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<header className="h-20 border-b-2 border-neutral-200 bg-white" />}>
        <Header />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
