import { type UserCode, type Response, type UserFormData, type UserLogIn, type UserSession } from '@/type'
import Cookies from 'js-cookie'

export async function createUser (data: UserFormData): Promise<Response> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'user/customer', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = error.message
    if (error.status === 'duplicate') errorMessage = 'El email ya esta registrado.'
    if (error.status === 'warning') errorMessage = `Vuelva a intentarlo dentro de ${Math.ceil(Number(error.message) / 60)} minutos`
    throw new Error(errorMessage)
  }

  const apiResponse = await response.json()
  return apiResponse
}

export async function resendVerificationCode (email: string): Promise<Response> {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'user-verification-code', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = error.message
    if (error.status === 'warning') errorMessage = `Vuelva a intentarlo dentro de ${Math.ceil(Number(error.message) / 60)} minutos`
    throw new Error(errorMessage)
  }

  const apiResponse = await response.json()
  return apiResponse
}

export async function verifyUser (data: UserCode): Promise<Response> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'user-verify', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    const errorMessage = error.message
    throw new Error(errorMessage)
  }

  const apiResponse = await response.json()
  return apiResponse
}

export async function authUser (data: UserLogIn): Promise<Response> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'auth', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = error.message
    if (error.status === 'warning') errorMessage = 'Correo o contraseña incorrectos.'
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function userInfo (): Promise<UserSession> {
  if (Cookies.get('SJSWSTN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Cookies.get('SJSWSTN')}`
    }
  }
  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'user', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    throw new Error(error.message)
  }
  const data = await response.json()
  return data
}

export async function updateCostumer (data: UserSession): Promise<Response> {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'user', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    throw new Error(error.message)
  }

  const apiResponse = await response.json()
  return apiResponse
}
