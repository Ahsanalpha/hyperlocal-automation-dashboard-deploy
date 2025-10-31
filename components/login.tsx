"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock } from "lucide-react"
import Image from "next/image"

interface LoginProps {
  onLogin: (password: string) => void
  error?: string
}

export function Login({ onLogin, error }: LoginProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    onLogin(password)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-4 px-4 sm:px-6">
          <div className="flex justify-center">
            <Image src="/jumper-logo.png" alt="Jumper Media" width={200} height={46} className="h-10 sm:h-12 w-auto" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">Jumper Media Automations</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your password to access the dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${error ? "border-red-500" : ""}`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
