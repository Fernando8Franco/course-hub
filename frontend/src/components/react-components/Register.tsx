import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMutation } from '@tanstack/react-query'
import { postUserData } from '@/services/User'
import { type UserData } from '@/type'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nombre muy corto'
  }).max(40, {
    message: 'Nombre muy largo'
  }),
  father_last_name: z.string().min(2, {
    message: 'Appellido paterno muy corto'
  }).max(40, {
    message: 'Appellido paterno muy largo'
  }),
  mother_last_name: z.string().min(2, {
    message: 'Appellido materno muy corto'
  }).max(40, {
    message: 'Appellido materno muy largo'
  }),
  birthday: z.date({
    required_error: 'Se requiere la fecha de nacimiento'
  }),
  phone_number: z.string().regex(/^\d+$/, {
    message: 'Solo se pueden ingresar números'
  }).min(10, {
    message: 'Número de teléfono muy corto'
  }).max(15, {
    message: 'Número de teléfono muy largo'
  }),
  email: z.string().email({
    message: 'Email no valido'
  }),
  password: z.string().min(5, {
    message: 'Contraseña muy corta'
  }).max(80, {
    message: 'Contraseña muy larga'
  })
})

export default function Register () {
  const { mutate, isPending, isSuccess, isError, error } = useMutation({ mutationFn: postUserData })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      father_last_name: '',
      mother_last_name: '',
      phone_number: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (formData: UserData) => {
    try {
      mutate(formData)
      if (!isPending && isSuccess) {
        await toast({
          title: 'Exito'
        })
      }
      if (!isPending && isError) {
        await toast({
          title: 'Error',
          description: error.message
        })
      }
    } catch (error) {
      toast({
        title: 'Scheduled: Catch up'
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mx-auto grid w-[350px] gap-3">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Registro</h1>
            <p className="text-balance text-muted-foreground">
              Llena el siguiente formulario para crear tu cuenta
            </p>
          </div>
          <div className="grid gap-1.5">
              <FormField
                control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
          </div>
          <Button className='pt-1.5' type="submit">Enviar</Button>
        </div>
      </form>
    </Form>
  )
}
