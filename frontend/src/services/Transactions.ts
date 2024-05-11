import { type UserTransactionImage, type Response, type Transaction } from '@/type'
import Cookies from 'js-cookie'

export async function getPendingTransactions (): Promise<Transaction[]> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'transactions-pending-with-image', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function getTransactions (status: string): Promise<Transaction[]> {
  if (Cookies.get('SJASWDSTMN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}transactions/${status}`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function updateTransactionState (data: { transactionId: string, status: number }): Promise<Response> {
  const requestOptions = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}transaction/${data.transactionId}/${data.status}`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  const apiResponse = await response.json()
  return apiResponse
}

export async function deleteTransaction (transactionId: string): Promise<Response> {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('SJASWDSTMN')}`
    }
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}transaction/${transactionId}`, requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  const apiResponse = await response.json()
  return apiResponse
}

export async function postTransaction (courseId: { course_id: number }): Promise<Response> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('SJSWSTN')}`
    },
    body: JSON.stringify(courseId)
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'transaction', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function postImageTransaction (data: UserTransactionImage): Promise<Response> {
  const formData = new FormData()
  const imageFile = (data.image === undefined) ? '' : data.image[0]
  formData.append('transaction_id', data.transaction_id)
  formData.append('image', imageFile)

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('SJSWSTN')}`
    },
    body: formData
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'transaction-image', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    let errorMessage = 'Hubo un problema con la solicitud.'
    if (error.message === 'Expired token') errorMessage = 'La sesión a caducado.'
    throw new Error(errorMessage)
  }

  return await response.json()
}
