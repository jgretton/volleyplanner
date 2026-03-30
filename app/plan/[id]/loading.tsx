import { Skeleton } from '@/components/ui/Skeleton'
import { PlanSkeleton } from '@/components/plan/PlanSkeleton'

export default function SavedPlanLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {/* View toggle */}
      <div className="mb-6">
        <Skeleton className="h-10 w-52 rounded-md" />
      </div>

      <PlanSkeleton />

    </div>
  )
}
