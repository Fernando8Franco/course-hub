import { type Response, type UserTransaction } from '@/type'
import Cookies from 'js-cookie'

export async function getCustomerTransactions (): Promise<UserTransaction[]> {
  if (Cookies.get('SJSWSTN') === undefined) throw new Error('No token')
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Cookies.get('SJSWSTN')}`
    }
  }
  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'transactions-customer', requestOptions)
  if (!response.ok) {
    const error = await response.json() as Response
    throw new Error(error.message)
  }
  const data = await response.json()
  return data
}
