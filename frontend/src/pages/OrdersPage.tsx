import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { DataTable } from '@/components/react-components/DataTable'
import { ColumnsCustomerTransactions } from '@/components/datatable-columns/ColumnsCustomerTransactions'
import { useUser } from '@/hooks/useUser'

export default function OrdersPage () {
  const { user } = useUser()

  return (
    <Card className="overflow-x-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          Pedidos
        </CardTitle>
        <CardDescription>
          Consulta de los pedidos realizados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={ColumnsCustomerTransactions} data={user?.transactions} message='No tienes pedidos.'/>
      </CardContent>
    </Card>
  )
}
