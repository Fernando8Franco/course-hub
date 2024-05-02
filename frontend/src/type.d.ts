export interface Course {
  id: number
  name: string
  description: string
  price: string
  instructor: string
  modality: string
  image: string
  school_name: string
}

export interface School {
  name: string
}

export interface UserData {
  id: string
  name: string
  father_last_name: string
  mother_last_name: string
  phone_number: string
  email: string
}
