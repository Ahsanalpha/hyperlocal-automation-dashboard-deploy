"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// You can change this password to whatever you want
const CORRECT_PASSWORD = "jumper2024"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already authenticated on page load
  useEffect(() => {
    const authStatus = localStorage.getItem("dashboard-auth")
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("dashboard-auth", "authenticated")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("dashboard-auth")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
