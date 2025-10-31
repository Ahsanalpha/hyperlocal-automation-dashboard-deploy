"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { LogOut, Search, Plus, ExternalLink } from "lucide-react"

import { Input } from "@/components/ui/input"

import Image from "next/image"

export default function Page() {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image src="/jumper-logo.png" alt="Jumper Media" width={200} height={46} className="h-8 sm:h-10 w-auto" />
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              className="flex items-center space-x-1 sm:space-x-2 bg-transparent text-xs sm:text-sm px-2 sm:px-4"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">View Report</h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by business name..."
                value={8}
                onChange={(e) => null}
                className="pl-10 sm:w-64"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
