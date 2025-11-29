"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface Job {
  _id: string
  title: string
  clinicId: { name: string; email: string }
  description: string
  city: string
  state: string
  jobType: string
  qualificationRequired: string
  specializationRequired?: string
  minExperienceYears: number
  salaryRange?: { min: number; max: number }
  shifts?: string
  workingDays?: string
}

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient.get(`/jobs/${jobId}`)
        setJob(response.data)
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!job) {
    return <div className="flex items-center justify-center h-screen">Job not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Dental Recruit
          </Link>
          <Link href="/jobs">
            <Button variant="outline">Back to Jobs</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
          <p className="text-lg text-foreground/70 mb-6">{job.clinicId?.name}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-foreground/60 uppercase tracking-wide">Location</p>
                <p className="text-lg font-medium">
                  {job.city}, {job.state}
                </p>
              </div>
              <div className="border-b pb-4">
                <p className="text-sm text-foreground/60 uppercase tracking-wide">Job Type</p>
                <p className="text-lg font-medium capitalize">{job.jobType}</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-sm text-foreground/60 uppercase tracking-wide">Qualification</p>
                <p className="text-lg font-medium">{job.qualificationRequired}</p>
              </div>
            </div>

            <div className="space-y-4">
              {job.salaryRange && (
                <div className="border-b pb-4">
                  <p className="text-sm text-foreground/60 uppercase tracking-wide">Salary Range</p>
                  <p className="text-lg font-medium">
                    ₹{job.salaryRange.min}k - ₹{job.salaryRange.max}k
                  </p>
                </div>
              )}
              <div className="border-b pb-4">
                <p className="text-sm text-foreground/60 uppercase tracking-wide">Experience</p>
                <p className="text-lg font-medium">{job.minExperienceYears}+ years</p>
              </div>
              {job.specializationRequired && (
                <div className="border-b pb-4">
                  <p className="text-sm text-foreground/60 uppercase tracking-wide">Specialization</p>
                  <p className="text-lg font-medium">{job.specializationRequired}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Position</h2>
            <p className="text-foreground/80 whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.shifts && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Shifts & Timing</h3>
              <p className="text-foreground/80">{job.shifts}</p>
            </div>
          )}

          {job.workingDays && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Working Days</h3>
              <p className="text-foreground/80">{job.workingDays}</p>
            </div>
          )}

          <div className="border-t pt-6">
            <p className="text-sm text-foreground/60 mb-4">Contact: {job.clinicId?.email}</p>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-2">Apply Now</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
