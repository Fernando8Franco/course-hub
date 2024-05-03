import { type UserInfo } from '@/type'
import { create } from 'zustand'

interface State {
  isLogIn: boolean
  userData: UserInfo | null
}

const useUserStore = create<State>(() => ({
  isLogIn: false,
  userData: null
}))

export default useUserStore
