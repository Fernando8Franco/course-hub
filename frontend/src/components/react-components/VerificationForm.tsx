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
import { Button } from '@/components/ui/button'
import { type z } from 'zod'
import useVerficationForm from '@/hooks/forms/useVerificationForm'
import useMutateVerification from '@/hooks/useMutateVerification'

interface Props {
  email: string
}

export default function VerificationForm ({ email }: Props) {
  const {
    mutateVerification,
    isPendingVerification,
    mutateSendVerification,
    isPendingSendVerification
  } = useMutateVerification()

  const { formVerificationShema, formVerification } = useVerficationForm({ email })

  async function onSubmitOTPForm (formData: z.infer<typeof formVerificationShema>) {
    try {
      await mutateVerification(formData)
    } catch (e) {
      console.log(e)
    }
  }

  const handleClick = async () => {
    try {
      await mutateSendVerification(email)
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
        <Form {...formVerification}>
          <form onSubmit={formVerification.handleSubmit(onSubmitOTPForm)}>
            <FormField
              control={formVerification.control}
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
            <div className='pt-8'>
              <Button type="submit" className='w-full' disabled={isPendingVerification}>
                {!isPendingVerification ? 'Validar' : 'Validando...'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Button variant='link'
          onClick={ handleClick }
          disabled={isPendingSendVerification}
        >
          {!isPendingSendVerification ? 'Reenviar el codigo de verificación' : 'Reenviando...'}
        </Button>
      </CardFooter>
    </Card>
  )
}
