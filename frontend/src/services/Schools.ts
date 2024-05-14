import { type FormSchoolType } from '@/hooks/forms/useSchoolForm'
import { type Response, type School } from '@/type'
import Cookies from 'js-cookie'

export async function getSchools (): Promise<School[]> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}schools`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function createSchool (data: FormSchoolType): Promise<Response> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}school`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function editSchool (data: FormSchoolType): Promise<Response> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}school`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function activateSchool (params: { schoolId: number, state: number }): Promise<Response> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}school/${params.schoolId}/${params.state}`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function deleteSchool (schoolId: number): Promise<Response> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}school/${schoolId}`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}
