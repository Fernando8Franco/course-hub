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
import { useMutation } from '@tanstack/react-query'
import { authUser } from '@/services/User'
import Cookies from 'js-cookie'

export function LoginForm () {
  const { toast } = useToast()
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
      Cookies.set('SSSNJWT', data.message, { expires: (1 / 1440) * 1 })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  async function onSubmitOTPForm (formData: z.infer<typeof formLoginSchema>) {
    await mutateAuth(formData)
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
          <form onSubmit={formLogin.handleSubmit(onSubmitOTPForm)}>
            <FormField
              control={formLogin.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
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
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-4'>
              <Button type="submit" className='w-full' disabled={isPending}>
                {!isPending ? 'Iniciar Sesión' : 'Iniciando...'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
