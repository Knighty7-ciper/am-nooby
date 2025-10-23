'use client'

import { StackProvider as Provider, StackTheme, StackClientApp } from '@stackframe/stack'

const stackClientApp = new StackClientApp({
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
