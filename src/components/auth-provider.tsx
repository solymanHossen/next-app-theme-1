"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, themeApiClient } from '@/lib/theme-api-client'
import { useLogin, useLogout } from '@/hooks/use-theme-api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  // Check authentication status on mount
  useEffect(() => {
    const currentUser = themeApiClient.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password })
      setUser(result.user)
      // Return success without redirecting here - let the login page handle it
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    logoutMutation.mutate()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && themeApiClient.isAuthenticated(),
    isAdmin: themeApiClient.isAdmin(),
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, adminOnly = false, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="text-center p-4">
        <p className="text-muted-foreground">Please log in to access this content.</p>
      </div>
    )
  }

  if (adminOnly && !isAdmin) {
    return fallback || (
      <div className="text-center p-4">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    )
  }

  return <>{children}</>
}

// Login Form Component
interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onSuccess, className }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await login(email, password)
      onSuccess?.()
    } catch (error) {
      // Error is already handled by the mutation
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </div>
    </form>
  )
}
