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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { type z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { formLoginSchema } from '@/formSchemas'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authUser } from '@/services/User'
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom'

export function LoginForm () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const formLogin = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const { mutateAsync: mutateAuth, isPending } = useMutation({
    mutationFn: authUser,
    onSuccess: (data) => {
      Cookies.set('SJSWSTN', data.message)
      void queryClient.invalidateQueries({ queryKey: ['user'] })
      toast({
        variant: 'success',
        title: 'Sesión iniciada correctamente'
      })
      navigate('/')
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  async function onSubmitLoginForm (formData: z.infer<typeof formLoginSchema>) {
    try {
      await mutateAuth(formData)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Card className="mx-auto my-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...formLogin}>
          <form onSubmit={formLogin.handleSubmit(onSubmitLoginForm)}>
            <FormField
              control={formLogin.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="f@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formLogin.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="pt-2 flex items-center">
                    <FormLabel htmlFor='password'>Contraseña</FormLabel>
                    <Link to='/reset-password' className="ml-auto inline-block text-sm underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <FormControl>
                    <Input id='password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col gap-2 pt-4'>
              <Button type="submit" className='w-full' disabled={isPending}>
                {!isPending ? 'Iniciar Sesión' : 'Iniciando...'}
              </Button>
              <Button variant='link' className='w-full'
                onClick={() => { navigate('/register') }}>
                Registrese Aquí
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
