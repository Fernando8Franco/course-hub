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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type z } from 'zod'
import useUpdateCustomerPasswordForm from '@/hooks/forms/useUpdateCustomerPasswordForm'
import useMutateUpdateCustomerPassword from '@/hooks/useMutateUpdateCustomerPassword'
import { useEffect } from 'react'

export default function UpdatePasswordPage () {
  const { formUpdateCustomerPasswordSchema, formUpdateCustomerPassword, handleReset } = useUpdateCustomerPasswordForm()
  const { mutateUpdateCustomerPassword, isPending, isSuccess } = useMutateUpdateCustomerPassword()

  async function onSubmitOTPForm (formData: z.infer<typeof formUpdateCustomerPasswordSchema>) {
    try {
      await mutateUpdateCustomerPassword(formData)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (isSuccess) handleReset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Contraseña
        </CardTitle>
        <CardDescription>
          Actualizar contraseña
        </CardDescription>
      </CardHeader>
      <CardContent className='mx-auto my-auto max-w-sm'>
        <div>
          <Form {...formUpdateCustomerPassword}>
            <form onSubmit={formUpdateCustomerPassword.handleSubmit(onSubmitOTPForm)}>
              <FormField
                control={formUpdateCustomerPassword.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='password'>Contraseña actual</FormLabel>
                    <FormControl>
                      <Input id='password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formUpdateCustomerPassword.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='new_password'>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input id='new_password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-center pt-4'>
                <Button type="submit" disabled={isPending}>
                  {!isPending ? 'Actualizar' : 'Actualizando...'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
