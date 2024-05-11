import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { DataTable } from '@/components/react-components/DataTable'
import { ColumnsPendingTransactions } from '@/components/datatable-columns/ColumnsPendingTransactions'
import { useTransactions } from '@/hooks/useTransactions'

export default function TransactionsPage () {
  const { transactions } = useTransactions('1')
  return (
    <Card className="overflow-x-auto mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          Transacciones
        </CardTitle>
        <CardDescription>
          Tabla de todas las transacciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={ColumnsPendingTransactions} data={transactions} message='No hay más transacciones.'/>
      </CardContent>
    </Card>
  )
}
