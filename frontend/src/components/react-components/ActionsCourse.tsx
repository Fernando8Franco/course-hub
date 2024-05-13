import { Check, PencilIcon, X, Trash2, Power, PowerOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useMutateActiveCourse, useMutateDeleteCourse } from '@/hooks/useMutateCourses'
import { type CoursesAdmin } from '@/type'
import { CourseForm } from './CourseForm'

interface Props {
  data: CoursesAdmin
}

export default function ActionsCourse ({ data }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleOpenChangeEdit = (nextOpenState: boolean) => {
    setIsEditDialogOpen(nextOpenState)
  }

  const { mutateDeleteCourse, isPendingDelete } = useMutateDeleteCourse()
  const { mutateActiveCourse, isPendingActive } = useMutateActiveCourse()
  const handleOpenChange = (nextOpenState: boolean) => {
    setIsDialogOpen(nextOpenState)
  }
  const handleDelete = () => {
    try {
      void mutateDeleteCourse(data.id)
    } catch (e) {
      console.log(e)
    } finally {
      setIsDialogOpen(false)
    }
  }

  const handleDeActivate = () => {
    const state: number = data.is_active === 1 ? 0 : 1
    try {
      void mutateActiveCourse({ courseId: data.id, state })
    } catch (e) {
      console.log(e)
    } finally {
      setIsDialogOpen(false)
    }
  }

  return (
    <div className='flex flex-row gap-4'>
    <Dialog open={isEditDialogOpen} onOpenChange={handleOpenChangeEdit}>
      <Button
        variant='warning'
        size="icon"
        className="h-11 w-11 rounded-full"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <span className="flex items-center justify-center h-full w-full">
                <PencilIcon className="h-5 w-5" />
              </span>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar</p>
          </TooltipContent>
        </Tooltip>
      </Button>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
        </DialogHeader>
        <CourseForm data={data} type='EDIT' messages={['Editar', 'Editando']} handleOpenChange={handleOpenChangeEdit}/>
      </DialogContent>
    </Dialog>

    {
      data.is_active === 1 &&
      <Button
        variant='destructive'
        size="icon"
        className="h-11 w-11 rounded-full"
        onClick={() => { handleDeActivate() }}
        disabled={isPendingActive}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center justify-center h-full w-full">
              <PowerOff className="h-5 w-5" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Desactivar</p>
          </TooltipContent>
        </Tooltip>
      </Button>
    }
    {
      data.is_active === 0 &&
      <Button
        variant='success'
        size="icon"
        className="h-11 w-11 rounded-full"
        onClick={() => { handleDeActivate() }}
        disabled={isPendingActive}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center justify-center h-full w-full">
              <Power className="h-5 w-5" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activar</p>
          </TooltipContent>
        </Tooltip>
      </Button>
    }

    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <Button
        variant='destructive'
        size="icon"
        className="h-11 w-11 rounded-full"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <span className="flex items-center justify-center h-full w-full">
                <Trash2 className="h-5 w-5" />
              </span>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Eliminar</p>
          </TooltipContent>
        </Tooltip>
      </Button>
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
            disabled={isPendingDelete}
            onClick={() => { handleDelete() }}
          >
            <Check className="mr-2 h-4 w-4" /> Si
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}
