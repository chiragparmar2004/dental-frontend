"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  salaryRange?: { min: number; max: number }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: "",
    jobType: "",
    qualificationRequired: "",
  })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.city) params.append("city", filters.city)
      if (filters.jobType) params.append("jobType", filters.jobType)
      if (filters.qualificationRequired) params.append("qualificationRequired", filters.qualificationRequired)

      const response = await apiClient.get(`/jobs?${params.toString()}`)
      setJobs(response.data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Dental Recruit
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/jobs" className="text-foreground hover:text-primary font-medium">
              Jobs
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Your Next Dental Job</h1>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <h2 className="font-semibold mb-4">Filters</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                placeholder="Enter city"
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters((prev) => ({ ...prev, jobType: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="locum">Locum</option>
                <option value="consultant">Consultant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Qualification</label>
              <select
                value={filters.qualificationRequired}
                onChange={(e) => setFilters((prev) => ({ ...prev, qualificationRequired: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">Any</option>
                <option value="BDS">BDS</option>
                <option value="MDS">MDS</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ city: "", jobType: "", qualificationRequired: "" })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">No jobs found</div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-foreground/70 mb-3">{job.clinicId?.name}</p>
                    <div className="flex gap-4 text-sm text-foreground/60">
                      <span>
                        {job.city}, {job.state}
                      </span>
                      <span className="capitalize">{job.jobType}</span>
                      <span>{job.qualificationRequired}</span>
                      {job.salaryRange && (
                        <span>
                          ₹{job.salaryRange.min}k - ₹{job.salaryRange.max}k
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/jobs/${job._id}`}>
                    <Button className="bg-primary hover:bg-primary/90">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
