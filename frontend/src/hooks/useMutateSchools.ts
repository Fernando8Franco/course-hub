import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { activateSchool, createSchool, deleteSchool, editSchool } from '@/services/Schools'

export function useMutateCreateSchool () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateCreateSchool, isPending: isPendingCreate } = useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['schools'] })
      toast({
        variant: 'success',
        title: 'Escuela Añadida Correctamente.'
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJASWDSTMN')
        navigate('/login', { replace: true })
      }
    }
  })

  return ({ mutateCreateSchool, isPendingCreate })
}

export function useMutateEditSchool () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateEditSchool, isPending: isPendingEdit } = useMutation({
    mutationFn: editSchool,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['schools'] })
      toast({
        variant: 'success',
        title: 'Escuela Actualizada Correctamente.'
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJASWDSTMN')
        navigate('/login', { replace: true })
      }
    }
  })

  return ({ mutateEditSchool, isPendingEdit })
}

export function useMutateActivateSchool () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateActivateSchool, isPending: isPendingActivate } = useMutation({
    mutationFn: activateSchool,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['schools'] })
      let message = ''
      if (data.message === 'School activated correctly') {
        message = 'Escuela activada correctamente.'
      } else {
        message = 'Escuela desactivada correctamente.'
      }
      toast({
        variant: 'success',
        title: message
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJASWDSTMN')
        navigate('/login', { replace: true })
      }
    }
  })

  return ({ mutateActivateSchool, isPendingActivate })
}

export function useMutateDeleteSchool () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateDeleteSchool, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['schools'] })
      toast({
        variant: 'success',
        title: 'Escuela Eliminada Correctamente.'
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJASWDSTMN')
        navigate('/login', { replace: true })
      }
    }
  })

  return ({ mutateDeleteSchool, isPendingDelete })
}
