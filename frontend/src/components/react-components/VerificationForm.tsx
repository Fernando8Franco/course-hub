import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { type z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { formOTPShema } from '@/formSchemas'
import { useNavigate } from 'react-router-dom'
import { resendVerificationCode, verifyUser } from '@/services/User'

interface Props {
  email: string
}

export default function VerificationForm ({ email }: Props) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { mutateAsync: mutateVerificationCode, isPending: isPendingResend } = useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: () => {
      toast({
        title: 'El email fue reenviado.'
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  const { mutateAsync: mutateValidUser, isPending: isPendingVerify } = useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      toast({
        title: 'El usuario fue validado correctamente.'
      })
      navigate('/login')
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  const formOTP = useForm<z.infer<typeof formOTPShema>>({
    resolver: zodResolver(formOTPShema),
    defaultValues: {
      verification_code: '',
      email
    }
  })

  async function onSubmitOTPForm (formData: z.infer<typeof formOTPShema>) {
    try {
      await mutateValidUser(formData)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Card className="mx-auto my-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Código de verificación
        </CardTitle>
        <CardDescription>
          Por favor, introduce el código de verificación que ha sido enviado a tu correo electrónico.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex justify-center'>
        <Form {...formOTP}>
          <form onSubmit={formOTP.handleSubmit(onSubmitOTPForm)}>
            <FormField
              control={formOTP.control}
              name="verification_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} pattern={'^[A-Z0-9]+$'} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formOTP.control}
              name="email"
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-8'>
              <Button type="submit" className='w-full' disabled={isPendingVerify}>
                {!isPendingVerify ? 'Validar' : 'Validando...'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Button variant='link'
          onClick={async () => await mutateVerificationCode(email)}
          disabled={isPendingResend}
        >
          {!isPendingResend ? 'Reenviar el codigo de verificación' : 'Reenviando...'}
        </Button>
      </CardFooter>
    </Card>
  )
}
