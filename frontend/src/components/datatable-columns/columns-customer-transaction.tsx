/* eslint-disable react-hooks/rules-of-hooks */
import { Image, ImageUp } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  TransformWrapper,
  TransformComponent
} from 'react-zoom-pan-pinch'
import { type ColumnDef } from '@tanstack/react-table'
import { type UserTransactionImage, type CostumerTransaction, type StatusVariant } from '../../type'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formImageSchema } from '@/formSchemas'
import { useForm } from 'react-hook-form'
import { type z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postImage } from '@/services/Transactions'

export const columnsCustomerTransaction: Array<ColumnDef<CostumerTransaction>> = [
  {
    header: () => <div className="w-[115px] text-left">Fecha de compra</div>,
    accessorKey: 'date_purchase',
    cell: ({ row }) => {
      const date: Date = row.getValue('date_purchase')
      const formattedDate = format(date, 'dd MMM yyyy', { locale: es })

      return <div>{formattedDate}</div>
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
      return <span>{ parseFloat(price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }</span>
    }
  },
  {
    header: () => <div className="text-center">Recibo</div>,
    accessorKey: 'image',
    cell: ({ row }) => {
      const image: string = row.getValue('image')

      if (image === null) {
        const { toast } = useToast()
        const queryClient = useQueryClient()
        const { mutateAsync: mutateTransaction, isPending } = useMutation({
          mutationFn: postImage,
          onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['user'] })
            toast({
              variant: 'success',
              title: 'Recibo enviado correctamente'
            })
          },
          onError: (error) => {
            toast({
              variant: 'destructive',
              title: 'Oh no!',
              description: error.message
            })
          }
        })
        const id = row.original.transaction_id
        const [isSheetOpen, setIsSheetOpen] = useState(false)
        const formImage = useForm<z.infer<typeof formImageSchema>>({
          resolver: zodResolver(formImageSchema),
          defaultValues: {
            transaction_id: id
          }
        })

        const fileRef = formImage.register('image')

        const onSubmit = (data: UserTransactionImage) => {
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
              <Button variant="outline" onClick={() => { formImage.reset() }}>
                <ImageUp className='mr-2 h-4 w-4'/> Subir recibo
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent side='bottom' className='flex flex-col items-center'>
            <SheetHeader>
              <SheetTitle>Suba su imagen de su recibo y envíenla</SheetTitle>
            </SheetHeader>
              <Form {...formImage}>
                <form onSubmit={formImage.handleSubmit(onSubmit)} className="max-w-sm">
                  <FormField
                    control={formImage.control}
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
                              {...fileRef}
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
                  <FormField
                    control={formImage.control}
                    name='transaction_id'
                    render={() => (
                      <FormItem>
                        <FormControl>
                            <Input
                              className='hidden'
                            />
                          </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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

      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className='flex justify-center'>
              <Button variant="outline">
                <Image className='mr-2 h-4 w-4'/> Ver recibo
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <div className='pt-4'>
              <TransformWrapper>
                <TransformComponent>
                  <img src={import.meta.env.VITE_BACKEND_HOST + image} className="zoomedImage"/>
                </TransformComponent>
              </TransformWrapper>
            </div>
          </DialogContent>
        </Dialog>
      )
    }
  },
  {
    header: () => <div className="text-center">Estado</div>,
    accessorKey: 'transaction_state',
    cell: ({ row }) => {
      enum Status {
        PENDING = 'PENDING',
        COMPLETED = 'COMPLETED',
        CANCELED = 'CANCELED'
      }
      const transactionState: string = row.getValue('transaction_state')

      let status: StatusVariant = { name: 'Pendiente', variant: 'default' }
      if (transactionState === Status.PENDING) status = { name: 'Pendiente', variant: 'outline' }
      if (transactionState === Status.COMPLETED) status = { name: 'Completada', variant: 'success' }
      if (transactionState === Status.CANCELED) status = { name: 'Cancelada', variant: 'destructive' }

      return (
        <div className='flex justify-center'>
          <Badge className='w-[90px] flex justify-center' variant={status.variant}>
            {status.name}
          </Badge>
        </div>
      )
    }
  }
]
