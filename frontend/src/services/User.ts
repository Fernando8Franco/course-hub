import { type UserCode, type Response, type UserFormData, type UserLogIn, type UserSession, type UserPasswords, type UserData } from '@/type'
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

export async function login (data: UserLogIn): Promise<Response> {
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
    throw new Error(error.message)
  }

  return await response.json()
}

export async function sendReset (data: { email: string }): Promise<Response> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'send-reset-password-email', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Wrong password or email') errorMessage = 'Correo o contraseña incorrectos.'
    if (error.status === 'warning') errorMessage = `Vuelva a intentarlo dentro de ${Math.ceil(Number(error.message) / 60)} minutos`
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function sendResetPassword (data: { token: string | undefined, password: string, confirmPassword: string }): Promise<Response> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'reset-password', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Token expired') errorMessage = 'El token ha expirado.'
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

export async function updateCostumer (data: UserData): Promise<Response> {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJSWSTN')}`
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'user', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = error.message
    if (error.status === 'duplicate') errorMessage = 'El email ya esta registrado.'
    throw new Error(errorMessage)
  }

  const apiResponse = await response.json()
  return apiResponse
}

export async function updatePassword (data: UserPasswords): Promise<Response> {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJSWSTN')}`
    },
    body: JSON.stringify(data)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'update-password', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    throw new Error(error.message)
  }

  const apiResponse = await response.json()
  return apiResponse
}
