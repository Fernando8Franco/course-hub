import { type Course } from '@/type'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  cart: Course | null
  setCart: (school: Course, showToast: () => void) => void
  reset: () => void
}

const useCartStore = create<State>()(
  persist(
    (set) => ({
      cart: null,

      setCart: (selectedCart, showToast) => {
        set((state) => {
          if (state.cart !== null) {
            showToast()
            return { cart: state.cart }
          } else {
            return { cart: selectedCart }
          }
        })
      },

      reset: () => {
        set({ cart: null })
      }
    }),
    {
      name: 'food-storage'
    }
  )
)

export default useCartStore
