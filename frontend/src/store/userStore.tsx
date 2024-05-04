import { type UserSession } from '@/type'
import { create } from 'zustand'

interface State {
  isLogIn: boolean
  userData: UserSession | null
}

const useUserStore = create<State>(() => ({
  isLogIn: false,
  userData: null
}))

export default useUserStore
