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

export interface UserInfo {
  id: string
  name: string
  father_last_name: string
  mother_last_name: string
  phone_number: string
  email: string
}

export interface UserData {
  name: string
  father_last_name: string
  mother_last_name: string
  password: string
  birthday: Date
  phone_number: string
  email: string
}
