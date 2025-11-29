"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, User, FileText, Briefcase, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user && user.role !== "doctor") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || user.role !== "doctor") {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-muted-foreground">Unauthorized</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link 
              href="/doctor/dashboard" 
              className="text-2xl font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              Dental Recruit
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/doctor/dashboard" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                href="/doctor/profile" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link 
                href="/doctor/applications" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <FileText className="h-4 w-4" />
                Applications
              </Link>
              <Link 
                href="/jobs" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                Browse Jobs
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout()
                  router.push("/")
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
