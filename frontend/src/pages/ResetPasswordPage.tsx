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
import useResetPasswordForm from '@/hooks/useResetPasswordForm'
import { useParams } from 'react-router-dom'
import { type z } from 'zod'
import useResetPassword from '@/hooks/useResetPassword'

export default function ResetPasswordPage () {
  const params = useParams<{ token: string }>()
  const { formResetPasswordShema, formResetPassword } = useResetPasswordForm(params.token)
  const { mutateResetPassword, isPendingResetPassword } = useResetPassword()

  function onSubmit (data: z.infer<typeof formResetPasswordShema>) {
    try {
      void mutateResetPassword(data)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Card className="mx-auto my-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Contraseña</CardTitle>
        <CardDescription className='w-full'>
          Por favor ingrese su nueva contraseña y confirmela antes de mandarla.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Form {...formResetPassword}>
          <form onSubmit={formResetPassword.handleSubmit(onSubmit)}>
            <FormField
              control={formResetPassword.control}
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
            <FormField
              control={formResetPassword.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-4'>
              <Button type="submit" className='w-full' disabled={isPendingResetPassword}>
                {!isPendingResetPassword ? 'Enviar' : 'Enviando...'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
