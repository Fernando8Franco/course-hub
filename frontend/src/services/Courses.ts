import { type CoursesAdmin, type Course, type Response } from '@/type'
import Cookies from 'js-cookie'

export async function getCourses (): Promise<Course[]> {
  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'courses')
  if (!response.ok) {
    throw new Error('Error en la petición')
  }
  const data = await response.json()
  return data
}

export async function getCoursesAdmin (): Promise<CoursesAdmin[]> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }
  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'courses-admin', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    if (error.message === 'Wrong number of segments') errorMessage = 'Token no valido.'
    throw new Error(errorMessage)
  }
  const data = await response.json()
  return data
}

export async function deleteCourse (courseId: number): Promise<Response> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }
  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}course/${courseId}`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    if (error.message === 'Wrong number of segments') errorMessage = 'Token no valido.'
    throw new Error(errorMessage)
  }
  const data = await response.json()
  return data
}

export async function changeActiveCourse (params: { courseId: number, state: number }): Promise<Response> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }
  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}course/${params.courseId}/${params.state}`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    if (error.message === 'Wrong number of segments') errorMessage = 'Token no valido.'
    throw new Error(errorMessage)
  }
  const data = await response.json()
  return data
}
