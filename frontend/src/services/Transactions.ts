import { type UserTransactionImage, type Response } from '@/type'
import Cookies from 'js-cookie'

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
    throw new Error(error.message)
  }

  return await response.json()
}

export async function postImage (data: UserTransactionImage): Promise<Response> {
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
    throw new Error(error.message)
  }

  return await response.json()
}
