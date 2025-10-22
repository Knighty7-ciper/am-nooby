import 'server-only'
import { StackServerApp } from '@stackframe/stack'

export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    home: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  },
})
