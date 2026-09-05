import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest, signup as signupRequest } from '../api/auth'
import type { SignupPayload, User } from '../types'

const TOKEN_KEY = 'baestargram_token'
const USER_KEY = 'baestargram_user'

type AuthContextValue = {
  user: User | null
  token: string | null
  isReady: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(readStoredUser)

  const persist = (nextToken: string, nextUser: User) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isReady: true,
      login: async (username, password) => {
        const result = await loginRequest({ username, password })
        persist(result.access_token, result.user)
      },
      signup: async (payload) => {
        const result = await signupRequest(payload)
        persist(result.access_token, result.user)
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      },
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있어요.')
  return context
}
