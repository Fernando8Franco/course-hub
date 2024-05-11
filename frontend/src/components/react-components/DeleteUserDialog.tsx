import { Check, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useMutateDeleteUsers } from '@/hooks/useMutateUsers'

interface Props {
  userId: string
}

export default function DeleteDialog ({ userId }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutateDeleteUser, isPending } = useMutateDeleteUsers()
  const handleOpenChange = (nextOpenState: boolean) => {
    setIsDialogOpen(nextOpenState)
  }
  const handleDelete = () => {
    try {
      void mutateDeleteUser(userId)
    } catch (e) {
      console.log(e)
    } finally {
      setIsDialogOpen(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='destructive'>Eliminar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar Transacción</DialogTitle>
          <DialogDescription>
            ¿Seguro que desea eliminar esta transacción?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-center gap-8">
          <DialogClose asChild>
            <Button type="button" variant='destructive' size='lg'>
              <X className="mr-2 h-4 w-4" /> No
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant='success'
            size='lg'
            disabled={isPending}
            onClick={() => { handleDelete() }}
          >
            <Check className="mr-2 h-4 w-4" /> Si
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
