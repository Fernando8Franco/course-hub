import { type Course } from '@/type'

export async function getCourses (): Promise<Course[]> {
  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + 'courses')
  if (!response.ok) {
    throw new Error('Error en la petición')
  }
  const data = await response.json()
  return data as Course[]
}
