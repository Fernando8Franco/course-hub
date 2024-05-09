import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateCostumer } from '@/services/User'

export default function useMutateUpdateCustomer () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isDisable, setIsDisable] = useState(true)
  const navigate = useNavigate()

  const { mutateAsync: mutateUpdateCustomer, isPending } = useMutation({
    mutationFn: updateCostumer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
      toast({
        title: 'Los datos fueron actualizados correctamente.'
      })
      setIsDisable(true)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJSWSTN')
        navigate('/login')
      }
    }
  })

  function handleCheckedChange (isDisable: boolean) {
    setIsDisable(!isDisable)
  }

  return ({ isDisable, handleCheckedChange, mutateUpdateCustomer, isPending })
}
