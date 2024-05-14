import { ArrowUpDown } from 'lucide-react'
import { type School } from '@/type'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import ActionsSchools from '../react-components/ActionsSchools'

export const ColumnsSchools: Array<ColumnDef<School>> = [
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

      return (
        <div>
          <p>{name}</p>
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const school = row.original
      return (
        <ActionsSchools data={school}/>
      )
    }
  }
]
