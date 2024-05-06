import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard () {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
      <Skeleton className="h-[469px] w-[300px]" />
    </div>
  )
}
