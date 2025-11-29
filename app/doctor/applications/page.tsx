"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { FileText, MapPin, Calendar, ExternalLink, Briefcase, Loader2 } from "lucide-react"

interface Application {
  _id: string
  jobId: { _id: string; title: string; city: string; state: string }
  status: string
  createdAt: string
}

const getStatusConfig = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    applied: {
      label: "Applied",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    shortlisted: {
      label: "Shortlisted",
      className: "bg-secondary/20 text-secondary-foreground border-secondary/30",
    },
    hired: {
      label: "Hired",
      className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  }
  return statusMap[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    className: "bg-muted text-muted-foreground border-border",
  }
}

export default function DoctorApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiClient.get("/applications/my-applications")
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>

      <Card className="rounded-2xl shadow-md border-0 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No applications yet</p>
              <p className="text-muted-foreground mb-6">Start applying to jobs to see them here!</p>
              <Link href="/jobs">
                <Button className="rounded-xl gap-2">
                  <Briefcase className="h-4 w-4" />
                  Browse Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const statusConfig = getStatusConfig(app.status)
                return (
                  <div
                    key={app._id}
                    className="border rounded-xl p-6 bg-background hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {app.jobId?.title || "Untitled Job"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {app.jobId?.city}, {app.jobId?.state}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.className}`}
                        >
                          {statusConfig.label}
                        </span>
                        <Link href={`/jobs/${app.jobId?._id}`}>
                          <Button variant="outline" size="sm" className="rounded-lg gap-2">
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
