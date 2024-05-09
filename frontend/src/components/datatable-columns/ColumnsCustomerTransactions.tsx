import { type ColumnDef } from '@tanstack/react-table'
import { type CostumerTransaction } from '../../type'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import ImageForm from '../react-components/ImageForm'
import CheckImage from '../react-components/CheckImage'
import StatusBadge from '../react-components/StatusBadge'

export const ColumnsCustomerTransactions: Array<ColumnDef<CostumerTransaction>> = [
  {
    header: () => <div className="w-[115px] text-left">Fecha de compra</div>,
    accessorKey: 'date_purchase',
    cell: ({ row }) => {
      const date: Date = row.getValue('date_purchase')
      const formattedDate = format(date, 'dd MMM yyyy', { locale: es })

      return <>{formattedDate}</>
    }
  },
  {
    header: () => <div className="text-center">Curso</div>,
    accessorKey: 'course_name'
  },
  {
    header: 'Total',
    accessorKey: 'total_amount',
    cell: ({ row }) => {
      const price: string = row.getValue('total_amount')
      return <>{ parseFloat(price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }</>
    }
  },
  {
    header: () => <div className="text-center">Recibo</div>,
    accessorKey: 'image',
    cell: ({ row }) => {
      const image: string = row.getValue('image')

      if (image !== null) return <CheckImage image={image} />

      const transactionId = row.original.transaction_id
      return <ImageForm transactionId={transactionId}/>
    }
  },
  {
    header: () => <div className="text-center">Estado</div>,
    accessorKey: 'transaction_state',
    cell: ({ row }) => {
      const transactionState: string = row.getValue('transaction_state')

      return <StatusBadge transactionState={transactionState} />
    }
  }
]
