"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Redirect based on role
    if (user.role === "doctor") {
      router.push("/doctor/dashboard")
    } else if (user.role === "clinic") {
      router.push("/clinic/dashboard")
    } else if (user.role === "superadmin") {
      router.push("/admin/dashboard")
    }
  }, [user, router])

  return <div className="flex items-center justify-center h-screen">Redirecting...</div>
}
