import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { DataTable } from '@/components/react-components/DataTable'
import { ColumnsPendingTransactions } from '@/components/datatable-columns/ColumnsPendingTransactions'
import { usePendingTransactions } from '@/hooks/useTransactions'
import { useUser } from '@/hooks/useUser'

export default function DashboardPage () {
  const { user } = useUser()
  const { pendingTransactions } = usePendingTransactions()
  return (
    <>
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
          Course Hub Dashboard
        </CardTitle>
        <CardDescription className="text-balance leading-relaxed">
          Hola. {user?.name}. Hay {pendingTransactions?.length} transacciones por verificar.
        </CardDescription>
      </CardHeader>
    </Card>
    <Card className="overflow-x-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          Pedidos pendientes con recibo
        </CardTitle>
        <CardDescription>
          Estos son los pedidos por validar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={ColumnsPendingTransactions} data={pendingTransactions} message='No hay más transacciones pendientes.'/>
      </CardContent>
    </Card>
    </>
  )
}
