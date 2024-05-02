import { type Course } from '@/type' // Asumiendo que tienes un tipo Courses definido en '@/type'

export async function getCourses (): Promise<Course[]> {
  const response = await fetch('http://localhost:8080/backend/courses')
  if (!response.ok) {
    throw new Error('Error en la petición')
  }
  const data = await response.json()
  return data as Course[]
}
