import { Skeleton } from '@/components/ui/skeleton'

export default function UserPageSkeleton () {
  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <Skeleton className='mx-auto w-full gap-2 h-[220px]'/>
      <Skeleton className='mx-auto w-full gap-2 h-[410px]'/>
    </div>
  )
}
