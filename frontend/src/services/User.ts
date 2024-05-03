import { type UserData } from '@/type'
import axios from 'axios'

export async function postUserData (data: UserData) {
  try {
    const response = await axios.post(import.meta.env.VITE_BACKEND_HOST + 'user/customer', data)
    return response.data
  } catch (error) {
    throw new Error('Error al enviar los datos')
  }
}
