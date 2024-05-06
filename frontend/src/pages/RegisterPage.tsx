import { useState } from 'react'
import VerificationForm from '../components/react-components/VerificationForm'
import RegisterForm from '../components/react-components/RegisterForm'

export default function RegisterPage () {
  const [isSubmited, setIsSubmited] = useState(false)
  const [email, setEmail] = useState('')

  return !isSubmited
    ? <RegisterForm setIsSubmited={setIsSubmited} setEmail={setEmail}/>
    : <VerificationForm email={email}/>
}
