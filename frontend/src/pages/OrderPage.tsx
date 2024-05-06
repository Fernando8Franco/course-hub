import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTransactions } from '@/hooks/useTransactions'

export default function OrdersPage () {
  const { transactions } = useTransactions()
  console.log(transactions)
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[115px] text-left">Fecha de compra</TableHead>
              <TableHead className="cursor-pointer w-[170px]">Curso</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Recibo</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.transaction_id}>
                <TableCell className="font-medium">
                  {format(transaction.date_purchase, 'dd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell>{transaction.course_name}</TableCell>
                <TableCell>
                  {parseFloat(transaction.total_amount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </TableCell>
                <TableCell>
                  {transaction.image}
                  </TableCell>
                <TableCell className="text-right">
                  {transaction.transaction_state}
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      </Card>
  )
}
