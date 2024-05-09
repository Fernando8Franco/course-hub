import { useToast } from '@/components/ui/use-toast'
import { createCustomer } from '@/services/User'
import { useMutation } from '@tanstack/react-query'

interface Props {
  setIsSubmited: (isSubmited: boolean) => void
  setEmail: (email: string) => void
}

export default function useMutateRegister ({ setIsSubmited, setEmail }: Props) {
  const { toast } = useToast()
  const { mutateAsync: mutateRegister, isPending } = useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      setIsSubmited(true)
      setEmail(data.message)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  return ({ mutateRegister, isPending })
}
