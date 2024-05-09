import { Badge } from '@/components/ui/badge'
import { type StatusVariant } from '@/type'

enum Status {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

interface Props {
  transactionState: string
}

export default function StatusBadge ({ transactionState }: Props) {
  let status: StatusVariant = { name: 'Pendiente', variant: 'default' }
  if (transactionState === Status.PENDING) status = { name: 'Pendiente', variant: 'outline' }
  if (transactionState === Status.COMPLETED) status = { name: 'Completada', variant: 'success' }
  if (transactionState === Status.CANCELED) status = { name: 'Cancelada', variant: 'destructive' }

  return (
    <div className='flex justify-center'>
      <Badge className='w-[90px] flex justify-center' variant={status.variant}>
        {status.name}
      </Badge>
    </div>
  )
}
