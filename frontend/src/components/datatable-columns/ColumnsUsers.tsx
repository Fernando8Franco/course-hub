import { ArrowUpDown } from 'lucide-react'
import { type User } from '@/type'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '../ui/badge'
import DeleteUserDialog from '../react-components/DeleteUserDialog'

export const ColumnsUsers: Array<ColumnDef<User>> = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => { column.toggleSorting(column.getIsSorted() === 'asc') }}
        >
          Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    accessorKey: 'name',
    cell: ({ row }) => {
      const name: string = row.getValue('name')
      const transaction = row.original

      return (
        <div>
          <p>{name}</p>
          <p>{transaction.father_last_name}</p>
          <p>{transaction.mother_last_name}</p>
        </div>
      )
    }
  },
  {
    header: () => <div className="text-center">Cumpleaños</div>,
    accessorKey: 'birthday',
    cell: ({ row }) => {
      const date: Date = row.getValue('birthday')
      const formattedDate = format(date, 'dd MMM yyyy', { locale: es })

      return <p className='text-center'>{formattedDate}</p>
    }
  },
  {
    header: () => <div className="text-center">Contacto</div>,
    accessorKey: 'email',
    cell: ({ row }) => {
      const email: string = row.getValue('email')
      const transaction = row.original

      return (
        <div className='text-center'>
          <p>{email}</p>
          <p>{transaction.phone_number}</p>
        </div>
      )
    }
  },
  {
    header: () => <div className="text-center">Estado</div>,
    accessorKey: 'is_active',
    cell: ({ row }) => {
      const isActive: number = row.getValue('is_active')

      return (
        <div className='text-center'>
          {isActive === 1 && <Badge variant='success'>Activo</Badge>}
          {isActive === 0 && <Badge variant='destructive'>Inactivo</Badge>}
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      return (
        <DeleteUserDialog userId={user.id}/>
      )
    }
  }
]
