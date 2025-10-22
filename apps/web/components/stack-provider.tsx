'use client'

import { StackProvider as Provider, StackTheme } from '@stack-auth/next'

export function StackProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      projectId={process.env.NEXT_PUBLIC_STACK_PROJECT_ID!}
      publishableClientKey={process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!}
    >
      <StackTheme>
        {children}
      </StackTheme>
    </Provider>
  )
}
