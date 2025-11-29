"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"

interface Application {
  _id: string
  jobId: { title: string }
  status: string
  createdAt: string
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({ applied: 0, shortlisted: 0, rejected: 0, hired: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiClient.get("/applications/my-applications")
        setApplications(response.data)

        // Calculate stats
        const newStats = { applied: 0, shortlisted: 0, rejected: 0, hired: 0 }
        response.data.forEach((app: Application) => {
          newStats[app.status as keyof typeof newStats]++
        })
        setStats(newStats)
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
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}!</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Applications</p>
          <p className="text-3xl font-bold">{applications.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Shortlisted</p>
          <p className="text-3xl font-bold text-blue-600">{stats.shortlisted}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Hired</p>
          <p className="text-3xl font-bold text-green-600">{stats.hired}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Recent Applications</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-foreground/60">
            <p>No applications yet</p>
            <Link href="/jobs">
              <Button className="mt-4 bg-primary hover:bg-primary/90">Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 font-semibold">Job Title</th>
                  <th className="text-left py-3 font-semibold">Status</th>
                  <th className="text-left py-3 font-semibold">Applied Date</th>
                  <th className="text-left py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id} className="border-b hover:bg-secondary">
                    <td className="py-3">{app.jobId?.title}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    <td className="py-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Link href="/doctor/applications">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
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
