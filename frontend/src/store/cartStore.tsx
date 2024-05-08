import { type Course } from '@/type'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  cart: Course | null
  setCart: (school: Course) => void
  reset: () => void
}

const useCartStore = create<State>()(
  persist(
    (set) => ({
      cart: null,

      setCart: (cart) => { set({ cart }) },

      reset: () => {
        set({ cart: null })
      }
    }),
    {
      name: 'course-storage'
    }
  )
)

export default useCartStore
