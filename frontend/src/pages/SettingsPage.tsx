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
import { useToast } from '@/components/ui/use-toast'
import { type z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useUser } from '@/hooks/useUser'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCostumer } from '@/services/User'
import { formUpdateCustomerSchema } from '@/formSchemas'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function SettingsPage () {
  const { toast } = useToast()
  const [isDisable, setIsDisable] = useState(true)
  const { user, isLoading } = useUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutateAsync: updateUser, isPending } = useMutation({
    mutationFn: updateCostumer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
      toast({
        title: 'Los datos fueron actualizados correctamente.'
      })
      setIsDisable(true)
    },
    onError: (error) => {
      if (error.message === 'Expired token') {
        Cookies.remove('SJSWSTN')
        toast({
          title: 'Oh no!',
          description: 'La sesión a caducado. Por favor vuelve a iniciar sesión'
        })
        navigate('/login')
        return
      }
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  const formUpdateUser = useForm<z.infer<typeof formUpdateCustomerSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formUpdateCustomerSchema),
    defaultValues: {
      name: '',
      father_last_name: '',
      mother_last_name: '',
      phone_number: '',
      email: ''
    }
  })

  useEffect(() => {
    if (!isLoading && (user != null)) {
      formUpdateUser.reset(user)
    }
  }, [user, isLoading, formUpdateUser])

  async function onSubmitUserForm (formData: z.infer<typeof formUpdateCustomerSchema>) {
    try {
      await updateUser(formData)
    } catch (e) {
      console.log(e)
    }
  }

  function handleCheckedChange (e: boolean) {
    setIsDisable(!e)
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
          <Form {...formUpdateUser}>
            <form onSubmit={formUpdateUser.handleSubmit(onSubmitUserForm)}>
              <div className="grid gap-1.5 grid-cols-1 sm:grid-cols-3">
                <FormField
                  control={formUpdateUser.control}
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
                  control={formUpdateUser.control}
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
                  control={formUpdateUser.control}
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
                  control={formUpdateUser.control}
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
                  control={formUpdateUser.control}
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
                  control={formUpdateUser.control}
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