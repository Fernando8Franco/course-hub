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
import useSendResetForm from '@/hooks/useSendResetForm'
import useSendReset from '@/hooks/useSendReset'

export default function SendResetPage () {
  const { formSendResetShema, formSendReset } = useSendResetForm()
  const { mutateSendReset, isPendingSendReset } = useSendReset()

  function onSubmit (data: z.infer<typeof formSendResetShema>) {
    try {
      void mutateSendReset(data)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Card className="mx-auto my-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingrese su correo electrónico para recuperar su contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Form {...formSendReset}>
          <form onSubmit={formSendReset.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={formSendReset.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ejemplo@course.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isPendingSendReset}>
              {!isPendingSendReset ? 'Enviar' : 'Enviando...'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
