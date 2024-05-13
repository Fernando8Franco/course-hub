import { ArrowUpDown } from 'lucide-react'
import { type CoursesAdmin } from '@/type'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import ActionsCourse from '../react-components/ActionsCourse'

export const ColumnsCourses: Array<ColumnDef<CoursesAdmin>> = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => { column.toggleSorting(column.getIsSorted() === 'asc') }}
        >
          Curso
        <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    accessorKey: 'name',
    cell: ({ row }) => {
      const name: string = row.getValue('name')
      const course = row.original

      return (
        <div className='flex flex-col text-center w-[180px] gap-2'>
          <p>{name}</p>
          <div>
            {course.is_active === 1 && <Badge variant='success'>Activo</Badge>}
            {course.is_active === 0 && <Badge variant='destructive'>Inactivo</Badge>}
          </div>
        </div>
      )
    }
  },
  {
    header: () => <div className="text-center w-[185px]">Escuela</div>,
    accessorKey: 'school_name',
    cell: ({ row }) => {
      const schoolName: string = row.getValue('school_name')

      return <p className='text-center w-[185px]'>{schoolName}</p>
    }
  },
  {
    header: () => <div className="text-center w-[250px]">Descripción</div>,
    accessorKey: 'description',
    cell: ({ row }) => {
      const description: string = row.getValue('description')

      return <p className='text-center w-[250px]'>{description}</p>
    }
  },
  {
    header: () => <div className="text-center">Datos</div>,
    accessorKey: 'price',
    cell: ({ row }) => {
      const price: string = row.getValue('price')
      const course = row.original

      return (
        <div className='text-center'>
          <p>Precio: { parseFloat(price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }</p>
          <p>Instructor: {course.instructor}</p>
          <p>Modalidad: {course.modality}</p>
        </div>
      )
    }
  },
  {
    header: () => <div className="text-center w-[185px]">Escuela</div>,
    accessorKey: 'image',
    cell: ({ row }) => {
      const image: string = row.getValue('image')

      return (
        <img src={import.meta.env.VITE_BACKEND_HOST + image} className="top-0 left-0 w-[250.4px] h-[100px] object-cover rounded"/>
      )
    }
  },
  {
    header: () => <div className="text-center">Transacciones</div>,
    accessorKey: 'transaction_count_pending',
    cell: ({ row }) => {
      const transactionPending: string = row.getValue('transaction_count_pending')
      const course = row.original

      return (
        <div className='text-center'>
          <p>Pendiente: {transactionPending}</p>
          <p>Completadas: {course.transaction_count_completed}</p>
          <p>Canceladas: {course.transaction_count_canceled}</p>
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const course = row.original
      return (
        <ActionsCourse data={course}/>
      )
    }
  }
]
