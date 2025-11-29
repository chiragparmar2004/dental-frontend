"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"

interface Application {
  _id: string
  status: string
  noteFromDoctor: string
  internalNotes: string
  doctorProfile: {
    fullName: string
    qualification: string
    specialization: string
    experienceYears: number
    currentLocation: { city: string; state: string }
    expectedSalaryMin: number
    expectedSalaryMax: number
    cvUrl: string
  }
}

export default function ApplicantsPage() {
  const params = useParams()
  const jobId = params.id as string
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [internalNotes, setInternalNotes] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiClient.get(`/applications/job/${jobId}/applications`)
        setApplications(response.data)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [jobId])

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      setUpdatingId(appId)
      const notes = selectedApp?._id === appId ? internalNotes : ""
      const response = await apiClient.patch(`/applications/${appId}/status`, {
        status: newStatus,
        internalNotes: notes,
      })

      setApplications(applications.map((app) => (app._id === appId ? response.data : app)))
      setSelectedApp(null)
      setInternalNotes("")
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Job Applicants</h1>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center text-foreground/60">
          <p>No applications yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{app.doctorProfile?.fullName}</h3>
                  <div className="space-y-1 text-sm text-foreground/60">
                    <p>
                      {app.doctorProfile?.qualification}{" "}
                      {app.doctorProfile?.specialization && `- ${app.doctorProfile.specialization}`}
                    </p>
                    <p>{app.doctorProfile?.experienceYears} years experience</p>
                    <p>
                      {app.doctorProfile?.currentLocation?.city}, {app.doctorProfile?.currentLocation?.state}
                    </p>
                    <p>
                      ₹{app.doctorProfile?.expectedSalaryMin}k - ₹{app.doctorProfile?.expectedSalaryMax}k
                    </p>
                    {app.doctorProfile?.cvUrl && (
                      <a
                        href={app.doctorProfile.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View CV
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-foreground/60 mb-2">Candidate Notes</p>
                  <p className="text-sm">{app.noteFromDoctor || "No notes provided"}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Current Status</p>
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
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(selectedApp?._id === app._id ? null : app)}
                      className="w-full"
                    >
                      {selectedApp?._id === app._id ? "Close" : "Update Status"}
                    </Button>
                  </div>
                </div>
              </div>

              {selectedApp?._id === app._id && (
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Change Status</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["applied", "shortlisted", "rejected", "hired"].map((status) => (
                        <Button
                          key={status}
                          variant={app.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(app._id, status)}
                          disabled={updatingId === app._id}
                          className={app.status === status ? "bg-primary hover:bg-primary/90" : ""}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Internal Notes</label>
                    <textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="Add notes for your team..."
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
