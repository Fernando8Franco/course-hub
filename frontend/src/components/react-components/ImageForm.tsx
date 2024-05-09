import { ImageUp } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useImageTransactionForm from '@/hooks/forms/useImageTransactionForm'
import useMutateImageTransaction from '@/hooks/useMutateImageTransaction'
import { useState } from 'react'
import { type z } from 'zod'

interface Props {
  transactionId: string
}

export default function ImageForm ({ transactionId }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const {
    formImageTransactionSchema,
    formImageTransaction,
    fileImageTransactionRef
  } = useImageTransactionForm(transactionId)
  const { mutateTransaction, isPending } = useMutateImageTransaction()

  const onSubmit = (data: z.infer<typeof formImageTransactionSchema>) => {
    try {
      void mutateTransaction(data)
    } catch (e) {
      console.log(e)
    }
    setIsSheetOpen(false)
  }

  const handleOpenChange = (nextOpenState: boolean) => {
    setIsSheetOpen(nextOpenState)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div className='flex justify-center'>
          <Button variant='warning' onClick={() => { formImageTransaction.reset() }}>
            <ImageUp className='mr-2 h-4 w-4'/> Subir recibo
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side='bottom' className='flex flex-col items-center'>
        <SheetHeader>
          <SheetTitle>Suba su imagen de su recibo y envíenla</SheetTitle>
        </SheetHeader>
          <Form {...formImageTransaction}>
            <form onSubmit={formImageTransaction.handleSubmit(onSubmit)} className="max-w-sm">
              <FormField
                control={formImageTransaction.control}
                name="image"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Imagen'
                          type="file"
                          accept='.jpg, .jpeg, .png'
                          {...fileImageTransactionRef}
                          className="dark:file:text-foreground"
                          onChange={(event) => {
                            field.onChange(event.target?.files?.[0] ?? undefined)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <p className="text-end text-xs text-muted-foreground">
                Formatos admitidos: JPG | JPGE | PNG
              </p>
              <p className="text-end text-xs text-destructive">
                La imagen solo puede pesar menos de 300KB
              </p>
              <div className='pt-4 flex justify-center'>
              <Button type='submit' disabled={isPending}>
                Enviar
              </Button>
              </div>
            </form>
          </Form>
      </SheetContent>
    </Sheet>
  )
}
