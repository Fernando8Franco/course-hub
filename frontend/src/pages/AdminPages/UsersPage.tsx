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
import { useUsers } from '@/hooks/useUsers'
import { ColumnsUsers } from '@/components/datatable-columns/ColumnsUsers'

export default function UsersPage () {
  const { usersAdmin, userType, setUserType, isSuccess } = useUsers()

  const handleFilterChange = (filter: string) => {
    setUserType(filter)
  }

  return (
    <>
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Usuarios
          </CardTitle>
          <CardDescription>
            Tabla de todos los usuarios
          </CardDescription>
          <div className="mx-auto flex items-center justify-end w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Tipo de Usuario
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className='text-center'>Filtrar por estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={userType === 'customer'}
                    onSelect={() => { handleFilterChange('customer') }}
                    className='text-center'
                  >
                    Cliente
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={userType === 'admin'}
                    onSelect={() => { handleFilterChange('admin') }}
                    className='text-center'
                  >
                    Administrador
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={ColumnsUsers} data={isSuccess ? usersAdmin : []} message='No hay más transacciones.'/>
        </CardContent>
      </Card>
    </>
  )
}
