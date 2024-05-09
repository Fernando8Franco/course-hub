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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import useLoginForm from '@/hooks/useLoginForm'
import useMutateLogin from '@/hooks/useMutateLogin'

export function LoginForm () {
  const navigate = useNavigate()
  const { formLoginSchema, formLogin } = useLoginForm()
  const { mutateLogin, isPendingLogin } = useMutateLogin()

  async function onSubmitLoginForm (formData: z.infer<typeof formLoginSchema>) {
    try {
      await mutateLogin(formData)
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
                    <Input type='email' placeholder="ejemplo@course.com" {...field} />
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
                    <Link to='/send-reset' className="ml-auto inline-block text-sm underline">
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
              <Button type="submit" className='w-full' disabled={isPendingLogin}>
                {!isPendingLogin ? 'Iniciar Sesión' : 'Iniciando...'}
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
