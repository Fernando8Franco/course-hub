import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const MAX_IMAGE_SIZE_BYTES = 300 * 1024

export const formImageTransactionSchema = z.object({
  transaction_id: z.string(),
  image: z.instanceof(FileList)
    .optional()
    .refine((file) => file?.length === 1, 'Seleccione una imagen')
    .refine((fileList) => {
      const file = fileList?.[0]
      return (file != null) ? file.size <= MAX_IMAGE_SIZE_BYTES : true
    }, { message: 'La imagen es demasiado grande. El tamaño máximo permitido es de 300 KB' })
})

export default function useImageTransactionForm (id: string) {
  const formImageTransaction = useForm<z.infer<typeof formImageTransactionSchema>>({
    resolver: zodResolver(formImageTransactionSchema),
    defaultValues: {
      transaction_id: id
    }
  })

  const fileImageTransactionRef = formImageTransaction.register('image')

  return ({ formImageTransactionSchema, formImageTransaction, fileImageTransactionRef })
}
