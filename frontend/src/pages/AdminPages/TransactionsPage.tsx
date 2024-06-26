import { ListFilter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/react-components/DataTable'
import { useTransactions } from '@/hooks/useTransactions'
import { ColumnsTransactions } from '@/components/datatable-columns/ColumnsTransactions'

export default function TransactionsPage () {
  const { transactions, filter, setFilter, isSuccess } = useTransactions()

  const handleFilterChange = (filter: string) => {
    setFilter(filter)
  }

  return (
    <>
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Transacciones
          </CardTitle>
          <CardDescription>
            Tabla de todas las transacciones
          </CardDescription>
          <div className="mx-auto flex items-center justify-end w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Estado
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className='text-center'>Filtrar por estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={filter === ''}
                    onSelect={() => { handleFilterChange('') }}
                    className='text-center'
                  >
                    Todas
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={filter === '1'}
                    onSelect={() => { handleFilterChange('1') }}
                    className='text-center'
                  >
                    Pendientes
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={filter === '2'}
                    onSelect={() => { handleFilterChange('2') }}
                    className='text-center'
                  >
                    Completadas
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={filter === '3'}
                    onSelect={() => { handleFilterChange('3') }}
                    className='text-center'
                  >
                    Canceladas
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={ColumnsTransactions} data={isSuccess ? transactions : []} message='No hay más transacciones.'/>
        </CardContent>
      </Card>
    </>
  )
}
