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
