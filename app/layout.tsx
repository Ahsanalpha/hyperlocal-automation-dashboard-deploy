import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jumper Media Automations",
  description: "Client dashboard for managing Google Business Profile automation services",
  openGraph: {
    title: "Jumper Media Automations",
    description: "Client dashboard for managing Google Business Profile automation services",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jumper Media Automations",
    description: "Client dashboard for managing Google Business Profile automation services",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
