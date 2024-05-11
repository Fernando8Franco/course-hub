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

export interface Response {
  status: string
  message: string
}

export interface User {
  id: string
  name: string
  father_last_name: string
  mother_last_name: string
  birthday: Date
  phone_number: string
  email: string
  user_type: string
  is_active: number
  verification_code: null
}

export interface UserFormData {
  name: string
  father_last_name: string
  mother_last_name: string
  password: string
  birthday: Date
  phone_number: string
  email: string
}

export interface UserSession {
  id: string
  name: string
  birthday: Date
  father_last_name: string
  mother_last_name: string
  phone_number: string
  email: string
  user_type: string
  transactions: CostumerTransaction[]
}

export interface UserData {
  name: string
  father_last_name: string
  mother_last_name: string
  birthday: Date
  phone_number: string
  email: string
}

export interface UserCode {
  email: string
  verification_code: string
}

export interface UserLogIn {
  email: string
  password: string
}

export interface UserPasswords {
  password: string
  password: string
}

export interface CostumerTransaction {
  transaction_id: string
  date_purchase: Date
  total_amount: string
  transaction_state: string
  image: string
  course_name: string
}

export interface UserTransactionImage {
  transaction_id: string
  image?: FileList
}

export interface StatusVariant {
  name: string
  variant: 'default' | 'destructive' | 'success' | 'outline' | 'secondary' | null | undefined | 'warning'
}

export interface Transaction {
  transaction_id: string
  date_purchase: Date
  total_amount: string
  transaction_state: string
  image: string
  user_id: string
  name: string
  father_last_name: string
  mother_last_name: string
  email: string
  phone_number: string
  course_id: number
  course_name: string
  course_is_active: number
}
