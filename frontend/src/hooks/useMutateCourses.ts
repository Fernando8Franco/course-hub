import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { changeActiveCourse, createCourse, deleteCourse, editCourse } from '@/services/Courses'

export function useMutateDeleteCourse () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateDeleteCourse, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses-admin'] })
      toast({
        variant: 'success',
        title: 'Curso Eliminado Correctamente.'
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

  return ({ mutateDeleteCourse, isPendingDelete })
}

export function useMutateActiveCourse () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateActiveCourse, isPending: isPendingActive } = useMutation({
    mutationFn: changeActiveCourse,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['courses-admin'] })
      let message = ''
      if (data.message === 'Course activated correctly') {
        message = 'Curso activado correctamente.'
      } else {
        message = 'Curso desactivado correctamente.'
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

  return ({ mutateActiveCourse, isPendingActive })
}

export function useMutateCreateCourse () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateCreateCourse, isPending: isPendingCreate } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses-admin'] })
      toast({
        variant: 'success',
        title: 'Curso Agregado Correctamente.'
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

  return ({ mutateCreateCourse, isPendingCreate })
}

export function useMutateEditCourse () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateEditCourse, isPending: isPendingEdit } = useMutation({
    mutationFn: editCourse,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses-admin'] })
      toast({
        variant: 'success',
        title: 'Curso Agregado Correctamente.'
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

  return ({ mutateEditCourse, isPendingEdit })
}
