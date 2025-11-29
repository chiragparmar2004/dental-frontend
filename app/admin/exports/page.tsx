"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"

export default function ExportsPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleExport = async (type: "users" | "jobs" | "applications") => {
    try {
      setLoading(type)
      const response = await apiClient.get(`/admin/export/${type}`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${type}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    } catch (error) {
      console.error("Error exporting:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Export Data</h1>

      <Card className="p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Export Users</h3>
            <p className="text-sm text-foreground/60 mb-4">Download all doctors and clinics data as CSV</p>
            <Button
              onClick={() => handleExport("users")}
              disabled={loading === "users"}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading === "users" ? "Exporting..." : "Export Users"}
            </Button>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Export Jobs</h3>
            <p className="text-sm text-foreground/60 mb-4">Download all job postings data as CSV</p>
            <Button
              onClick={() => handleExport("jobs")}
              disabled={loading === "jobs"}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading === "jobs" ? "Exporting..." : "Export Jobs"}
            </Button>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Export Applications</h3>
            <p className="text-sm text-foreground/60 mb-4">Download all applications data as CSV</p>
            <Button
              onClick={() => handleExport("applications")}
              disabled={loading === "applications"}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading === "applications" ? "Exporting..." : "Export Applications"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
