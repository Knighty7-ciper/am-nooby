import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { PostEditor } from '@/components/post-editor'

export const metadata: Metadata = {
  title: 'Write a Post | Blog',
  description: 'Create and publish your next article',
}

export default async function WritePage({
  searchParams,
}: {
  searchParams: { id?: string; action?: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/api/auth/signin?callbackUrl=/write')
  }

  // Only AUTHOR, EDITOR, and ADMIN can write
  if (!['AUTHOR', 'EDITOR', 'ADMIN'].includes(user.role)) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <PostEditor postId={searchParams.id} />
    </div>
  )
}
