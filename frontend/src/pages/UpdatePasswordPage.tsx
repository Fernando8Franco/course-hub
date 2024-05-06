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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { formUpdatePasswordSchema } from '@/formSchemas'
import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePassword } from '@/services/User'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function UpdatePasswordPage () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const formUpdatePassword = useForm<z.infer<typeof formUpdatePasswordSchema>>({
    resolver: zodResolver(formUpdatePasswordSchema),
    defaultValues: {
      password: '',
      new_password: ''
    }
  })
  const { mutateAsync: mutateAuth, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
      toast({
        title: 'La contraseña fue actualizada correctamente.'
      })
      formUpdatePassword.reset()
    },
    onError: (error) => {
      if (error.message === 'Wrong Password') {
        toast({
          title: 'Oh no!',
          description: 'Contraseña incorrecta.'
        })
        return
      }
      if (error.message === 'Expired token') {
        Cookies.remove('SJSWSTN')
        toast({
          title: 'Oh no!',
          description: 'La sesión a caducado. Por favor vuelve a iniciar sesión.'
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

  async function onSubmitOTPForm (formData: z.infer<typeof formUpdatePasswordSchema>) {
    try {
      await mutateAuth(formData)
    } catch (e) {
      console.log(e)
    }
  }

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
          <Form {...formUpdatePassword}>
            <form onSubmit={formUpdatePassword.handleSubmit(onSubmitOTPForm)}>
              <FormField
                control={formUpdatePassword.control}
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
                control={formUpdatePassword.control}
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
