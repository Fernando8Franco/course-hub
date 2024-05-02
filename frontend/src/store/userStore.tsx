import { type UserData } from '@/type'
import { create } from 'zustand'

interface State {
  isLogIn: boolean
  userData: UserData | null
}

const useUserStore = create<State>(() => ({
  isLogIn: false,
  userData: null
}))

export default useUserStore
