import { CalendarIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { type z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMutation } from '@tanstack/react-query'
import { createUser } from '@/services/User'
import { formUserSchema } from '@/formSchemas'

interface Props {
  setIsSubmited: (isSubmited: boolean) => void
  setEmail: (email: string) => void
}

export default function RegisterForm ({ setIsSubmited, setEmail }: Props) {
  const { toast } = useToast()
  const { mutateAsync: mutateUser, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setIsSubmited(true)
      setEmail(data.message)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  const formUser = useForm<z.infer<typeof formUserSchema>>({
    resolver: zodResolver(formUserSchema),
    defaultValues: {
      name: '',
      father_last_name: '',
      mother_last_name: '',
      phone_number: '',
      email: '',
      password: ''
    }
  })

  async function onSubmitUserForm (formData: z.infer<typeof formUserSchema>) {
    console.log('xd')
    try {
      await mutateUser(formData)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Card className="mx-auto my-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Registro
        </CardTitle>
        <CardDescription>
          Llena el siguiente formulario para crear tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...formUser}>
          <form onSubmit={formUser.handleSubmit(onSubmitUserForm)}>
            <div className="grid gap-1.5">
              <FormField
                control={formUser.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-1.5 grid-cols-1 sm:grid-cols-2">
                <FormField
                  control={formUser.control}
                  name="father_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Paterno</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUser.control}
                  name="mother_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Materno</FormLabel>
                      <FormControl>
                        <Input placeholder="Hernández" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUser.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className='py-[5.5px]'>Fecha de nacimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
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
                  control={formUser.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Teléfonico</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567891" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUser.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="ejemplo@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUser.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='pt-2'>
                <Button className='w-full' type="submit" disabled={isPending}>
                  {!isPending ? 'Enviar' : 'Enviando'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
