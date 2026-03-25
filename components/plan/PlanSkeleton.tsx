import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'

export function PlanSkeleton() {
  return (
    <div className="space-y-6">

      {/* Overview skeleton */}
      <Card className="p-6">
        <Skeleton className="h-7 w-2/3 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-6" />
        <div className="flex gap-3 mb-6 flex-wrap">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-6 w-24 rounded-full" />)}
        </div>
        <Skeleton className="h-8 w-full rounded-lg" />
      </Card>

      {/* Drill skeletons */}
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="p-6">
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex-1">
              <Skeleton className="h-5 w-1/2 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-28 w-24 rounded-lg flex-shrink-0" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </Card>
      ))}

    </div>
  )
}
