'use client'

import { StackProvider as Provider, StackTheme, StackClientApp } from '@stackframe/stack'

const stackClientApp = new StackClientApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    home: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
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
