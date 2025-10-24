'use client'

import { StackProvider as Provider, StackTheme, StackClientApp } from '@stackframe/stack'

const stackClientApp = new StackClientApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  tokenStore: 'nextjs-cookie',
  urls: {
    home: '/',
    signIn: '/handler/sign-in',
    signUp: '/handler/sign-up',
    afterSignIn: '/',
    afterSignUp: '/',
  },
})

export function StackProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider app={stackClientApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </Provider>
  )
}
