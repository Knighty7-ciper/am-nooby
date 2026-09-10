import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { PostEditor } from '@/components/post-editor'
import { UpgradeToPro } from '@/components/upgrade-to-pro'
import { getRemainingPosts } from '@/lib/features'
import prisma from '@/lib/prisma'

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
    redirect('/handler/sign-in')
  }

  // Only AUTHOR, EDITOR, and ADMIN can write
  if (!['AUTHOR', 'EDITOR', 'ADMIN'].includes(user.role)) {
    redirect('/dashboard')
  }

  // If editing an existing post, allow it
  if (searchParams.id) {
    // Verify the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: searchParams.id },
      select: { authorId: true },
    })

    if (!post || (post.authorId !== user.id && user.role !== 'ADMIN')) {
      redirect('/dashboard?tab=posts')
    }

    // Allow editing
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <PostEditor postId={searchParams.id} />
      </div>
    )
  }

  // For new posts, check subscription limits
  const { remaining, total, used } = await getRemainingPosts(
    user.id,
    user.subscriptionPlan
  )

  // If no posts remaining (and not unlimited), show upgrade page
  if (remaining === 0) {
    return (
      <UpgradeToPro
        variant="post-limit"
        reason={`You've created ${used} of ${total} posts this month. Upgrade to Pro for unlimited posts!`}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Show remaining posts indicator for FREE users */}
      {remaining !== -1 && remaining <= 3 && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <p className="text-xs sm:text-sm text-orange-800">
              <span className="font-semibold">{remaining} post{remaining !== 1 ? 's' : ''} remaining</span> this month.
              {remaining === 1 && ' This is your last post for this month.'}
            </p>
            <a href="/pricing" className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark whitespace-nowrap">
              Upgrade to Pro →
            </a>
          </div>
        </div>
      )}
      <PostEditor postId={searchParams.id} />
    </div>
  )
}
