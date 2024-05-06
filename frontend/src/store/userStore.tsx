import { type UserSession } from '@/type'
import { create } from 'zustand'

interface State {
  user: UserSession | undefined
  isLogIn: boolean
  setLogIn: (logIn: boolean) => void
  setUser: (userSession: UserSession) => void
}

const useUserStore = create<State>()(
  (set) => ({
    user: undefined,
    isLogIn: false,
    setLogIn: (logIn) => { set({ isLogIn: logIn }) },
    setUser: (userSession) => { set({ user: userSession }) }
  })
)

export default useUserStore
