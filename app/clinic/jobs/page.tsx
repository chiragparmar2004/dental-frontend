"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

interface Job {
  _id: string
  title: string
  city: string
  jobType: string
  isActive: boolean
}

export default function ClinicJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get("/jobs/my-jobs")
        setJobs(response.data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await apiClient.delete(`/jobs/${jobId}`)
        setJobs(jobs.filter((j) => j._id !== jobId))
      } catch (error) {
        console.error("Error deleting job:", error)
      }
    }
  }

  const handleToggle = async (jobId: string) => {
    try {
      const response = await apiClient.patch(`/jobs/${jobId}/toggle`)
      const updated = response.data
      setJobs(jobs.map((j) => (j._id === jobId ? { ...j, isActive: updated.isActive } : j)))
    } catch (error) {
      console.error("Error toggling job:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Link href="/clinic/jobs/new">
          <Button className="bg-primary hover:bg-primary/90">Post New Job</Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">
            <p>No jobs posted yet</p>
            <Link href="/clinic/jobs/new">
              <Button className="mt-4 bg-primary hover:bg-primary/90">Post Your First Job</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 font-semibold">Job Title</th>
                  <th className="text-left py-3 font-semibold">Location</th>
                  <th className="text-left py-3 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Status</th>
                  <th className="text-left py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-b hover:bg-secondary">
                    <td className="py-3">{job.title}</td>
                    <td className="py-3">{job.city}</td>
                    <td className="py-3 capitalize">{job.jobType}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${job.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 space-x-2">
                      <Link href={`/clinic/jobs/${job._id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/clinic/jobs/${job._id}/applicants`}>
                        <Button variant="outline" size="sm">
                          Applicants
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleToggle(job._id)}>
                        {job.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(job._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
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
