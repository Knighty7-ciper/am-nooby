import { useEffect, useRef, useState } from 'react'

export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const observer = useRef<IntersectionObserver | null>(null)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback()
        }
      },
      { threshold: 0.1 }
    )

    observer.current.observe(element)

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [element, hasMore, callback])

  return setElement
}
