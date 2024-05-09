import { createContext, type PropsWithChildren, useContext, useState } from 'react'
import { type UserSession } from '@/type'
import { useUser } from '@/hooks/useUser'

const AuthContext = createContext<UserSession | undefined>(undefined)

type AuthProviderProps = PropsWithChildren & {
  isLogIn?: boolean
}

export default function AuthProvider ({
  children,
  isLogIn
}: AuthProviderProps) {
  const { user } = useUser()
  const [userSession] = useState<UserSession | undefined>((isLogIn ?? false) ? user : undefined)

  return <AuthContext.Provider value={userSession}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
