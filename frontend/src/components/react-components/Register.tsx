import { useState } from 'react'
import VerificationForm from './VerificationForm'
import RegisterForm from './RegisterForm'

export default function Register () {
  const [isSubmited, setIsSubmited] = useState(false)
  const [email, setEmail] = useState('')

  return !isSubmited
    ? <RegisterForm setIsSubmited={setIsSubmited} setEmail={setEmail}/>
    : <VerificationForm email={email}/>
}
