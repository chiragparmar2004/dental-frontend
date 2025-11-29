"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface Job {
  _id: string
  title: string
  clinicId: { name: string }
  city: string
  state: string
  jobType: string
  qualificationRequired: string
  isActive: boolean
  createdAt: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get("/admin/jobs")
        setJobs(response.data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Jobs</h1>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">No jobs posted yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 font-semibold">Title</th>
                  <th className="text-left py-3 font-semibold">Clinic</th>
                  <th className="text-left py-3 font-semibold">Location</th>
                  <th className="text-left py-3 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Qualification</th>
                  <th className="text-left py-3 font-semibold">Status</th>
                  <th className="text-left py-3 font-semibold">Posted</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-b hover:bg-secondary">
                    <td className="py-3">{job.title}</td>
                    <td className="py-3">{job.clinicId?.name}</td>
                    <td className="py-3">
                      {job.city}, {job.state}
                    </td>
                    <td className="py-3 capitalize">{job.jobType}</td>
                    <td className="py-3">{job.qualificationRequired}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${job.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-foreground/60">{new Date(job.createdAt).toLocaleDateString()}</td>
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
