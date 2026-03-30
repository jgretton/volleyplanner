import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>

      {/* Stat tiles */}
      <div className="bg-vp-surface border border-vp-border rounded-xl grid grid-cols-3 divide-x divide-vp-border mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="px-5 py-4 flex flex-col gap-2">
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Search + filter row */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-9 w-56 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-lg ml-auto" />
      </div>

      {/* Plan card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-vp-surface border border-vp-border border-l-4 border-l-vp-border rounded-xl overflow-hidden">
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="px-5 py-3 border-t border-vp-border flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
