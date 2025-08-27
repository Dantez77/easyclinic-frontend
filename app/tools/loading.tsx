export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-main-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-main-800">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-muted animate-pulse rounded" />
            <div>
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {/* Tabs Skeleton */}
          <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>

          {/* Card Skeleton */}
          <div className="border border-main-200 dark:border-main-800 rounded-lg p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="h-9 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-9 w-9 bg-muted animate-pulse rounded" />
                </div>
              </div>
              
              {/* List Items Skeleton */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
