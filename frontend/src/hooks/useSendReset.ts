import { useToast } from '@/components/ui/use-toast'
import { sendReset } from '@/services/User'
import { useMutation } from '@tanstack/react-query'

export default function useSendReset () {
  const { toast } = useToast()
  const { mutateAsync: mutateSendReset, isPending: isPendingSendReset } = useMutation({
    mutationFn: sendReset,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Email enviado correctamente. Puedes cerrar esta pestaña.'
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

  return ({ mutateSendReset, isPendingSendReset })
}
