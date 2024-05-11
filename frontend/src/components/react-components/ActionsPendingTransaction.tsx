import { Button } from '../ui/button'
import { useMutatePendingTransactions } from '@/hooks/useMutateTransactions'

interface Props {
  transactionId: string
}

export default function ActionsPendingTransaction ({ transactionId }: Props) {
  const { mutateTransactionState, isPending } = useMutatePendingTransactions()

  const handleCompleted = () => {
    try {
      void mutateTransactionState({ transactionId, status: 2 })
    } catch (e) {
      console.log(e)
    }
  }

  const handleCanceled = () => {
    try {
      void mutateTransactionState({ transactionId, status: 3 })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='flex flex-row gap-4'>
      <Button variant='success' onClick={handleCompleted} disabled={isPending}>
        Aceptar
      </Button>
      <Button variant='destructive' onClick={handleCanceled} disabled={isPending}>
        Cancelar
      </Button>
    </div>
  )
}
