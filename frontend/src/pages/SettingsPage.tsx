import { CalendarIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { type z } from 'zod'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Separator } from '@/components/ui/separator'
import useUpdateCustomerForm from '@/hooks/forms/useUpdateCustomerForm'
import useMutateUpdateCustomer from '@/hooks/useMutateUpdateCustomer'

export default function SettingsPage () {
  const { formUpdateCustomerSchema, formUpdateCustomer } = useUpdateCustomerForm()
  const { isDisable, handleCheckedChange, mutateUpdateCustomer, isPending } = useMutateUpdateCustomer()

  async function onSubmitUserForm (data: z.infer<typeof formUpdateCustomerSchema>) {
    try {
      await mutateUpdateCustomer(data)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Usuario
          </CardTitle>
          <CardDescription>
            Datos del usuario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 pb-3">
            <Checkbox id="data" checked={!isDisable} onCheckedChange={handleCheckedChange}/>
            <label
              htmlFor="data"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Modificar los datos
            </label>
          </div>
          <Form {...formUpdateCustomer}>
            <form onSubmit={formUpdateCustomer.handleSubmit(onSubmitUserForm)}>
              <div className="grid gap-1.5 grid-cols-1 sm:grid-cols-3">
                <FormField
                  control={formUpdateCustomer.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isDisable}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUpdateCustomer.control}
                  name="father_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Paterno</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isDisable}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUpdateCustomer.control}
                  name="mother_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Materno</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isDisable}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUpdateCustomer.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className='py-[5.5px]'>Fecha de nacimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              disabled={isDisable}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !(field.value != null) && 'text-muted-foreground'
                              )}
                            >
                              {(field.value != null)
                                ? (
                                    format(field.value, 'dd MMM yyyy', { locale: es })
                                  )
                                : (
                                <span>Escoje una fecha</span>
                                  )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            defaultMonth={new Date(2001, 0)}
                            captionLayout="dropdown"
                            fromYear={1925} toYear={2025}
                            locale={es}
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUpdateCustomer.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Teléfonico</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isDisable}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUpdateCustomer.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isDisable}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-full pt-8'>
                <Separator/>
              </div>
              <div className='flex justify-end pt-6'>
                <Button type="submit" disabled={isDisable || isPending}>
                  {!isPending ? 'Actualizar' : 'Actualizando...'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
