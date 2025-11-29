"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"

interface Job {
  _id: string
  title: string
  isActive: boolean
}

interface Application {
  status: string
}

export default function ClinicDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, applied: 0, shortlisted: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await apiClient.get("/jobs/my-jobs")
        setJobs(jobsRes.data)

        // Fetch applications for all jobs
        const allApps: Application[] = []
        for (const job of jobsRes.data) {
          try {
            const appsRes = await apiClient.get(`/applications/job/${job._id}/applications`)
            allApps.push(...(Array.isArray(appsRes.data) ? appsRes.data : []))
          } catch (error) {
            console.error(`Error fetching applications for job ${job._id}:`, error)
          }
        }
        setApplications(allApps)

        // Calculate stats
        const stats = {
          totalJobs: jobsRes.data.length,
          totalApplications: allApps.length,
          applied: allApps.filter((a: any) => a.status === "applied").length,
          shortlisted: allApps.filter((a: any) => a.status === "shortlisted").length,
        }
        setStats(stats)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}!</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Jobs</p>
          <p className="text-3xl font-bold">{stats.totalJobs}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Applications</p>
          <p className="text-3xl font-bold">{stats.totalApplications}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Applied</p>
          <p className="text-3xl font-bold text-blue-600">{stats.applied}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Shortlisted</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.shortlisted}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <Link href="/clinic/jobs/new">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">Post New Job</Button>
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-foreground/60 text-sm">Total: {stats.totalApplications} applications received</p>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Your Recent Jobs</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-foreground/60">
            <p>No jobs posted yet</p>
            <Link href="/clinic/jobs/new">
              <Button className="mt-4 bg-primary hover:bg-primary/90">Post First Job</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-xs text-foreground/60">{job.isActive ? "Active" : "Inactive"}</p>
                </div>
                <Link href={`/clinic/jobs/${job._id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
