"use client"

import type React from "react"

import { StackProvider as Provider, StackTheme } from "@stackframe/stack"
import { useEffect, useState } from "react"

export function StackProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<{ projectId: string; publishableClientKey: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/stack-config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => setError(err.message))
  }, [])

  if (!config) {
    return <>{children}</>
  }

  if (error) {
    console.error("Failed to load Stack config:", error)
    return <>{children}</>
  }

  return (
    <Provider projectId={config.projectId} publishableClientKey={config.publishableClientKey}>
      <StackTheme>{children}</StackTheme>
    </Provider>
  )
}
