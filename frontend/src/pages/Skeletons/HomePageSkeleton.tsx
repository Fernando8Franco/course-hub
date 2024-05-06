import { SkeletonCard } from '@/components/react-components/SkeletonCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomePageSkeleton () {
  return (
    <>
      <Skeleton className='mx-auto flex items-center justify-between w-full gap-2 h-[35px]'/>
      <SkeletonCard/>
    </>
  )
}
