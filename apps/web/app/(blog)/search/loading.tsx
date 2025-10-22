import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchLoading() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Search</h1>

        <div className="flex gap-2 mb-6">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="h-10 w-10" />
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="grid gap-6">
              {[1, 2].map((j) => (
                <Card key={j} className="p-4">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
