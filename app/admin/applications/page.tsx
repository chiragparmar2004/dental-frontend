"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface Application {
  _id: string
  jobId: { title: string }
  doctorId: { name: string; email: string }
  status: string
  createdAt: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiClient.get("/admin/applications")
        setApplications(response.data)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Applications</h1>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">No applications yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 font-semibold">Job</th>
                  <th className="text-left py-3 font-semibold">Doctor</th>
                  <th className="text-left py-3 font-semibold">Email</th>
                  <th className="text-left py-3 font-semibold">Status</th>
                  <th className="text-left py-3 font-semibold">Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-secondary">
                    <td className="py-3">{app.jobId?.title}</td>
                    <td className="py-3">{app.doctorId?.name}</td>
                    <td className="py-3">{app.doctorId?.email}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          app.status === "applied"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "shortlisted"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "hired"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-foreground/60">{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
