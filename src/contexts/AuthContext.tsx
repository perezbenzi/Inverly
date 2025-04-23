import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { 
  auth, 
  loginUser, 
  registerUser, 
  logoutUser, 
  deleteUserAccount, 
  deleteUserAccountWithReauth, 
  reauthenticate,
  changePassword
} from '../lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  deleteAccount: () => Promise<void>
  deleteAccountWithReauth: (password: string) => Promise<void>
  reauthenticateUser: (password: string) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    await loginUser(email, password)
  }

  const register = async (email: string, password: string) => {
    await registerUser(email, password)
  }

  const logout = async () => {
    await logoutUser()
  }

  const deleteAccount = async () => {
    await deleteUserAccount()
  }

  const deleteAccountWithReauth = async (password: string) => {
    await deleteUserAccountWithReauth(password)
  }

  const reauthenticateUser = async (password: string) => {
    await reauthenticate(password)
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await changePassword(currentPassword, newPassword)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    deleteAccount,
    deleteAccountWithReauth,
    reauthenticateUser,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 