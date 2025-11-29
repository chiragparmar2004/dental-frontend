"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface Doctor {
  user: { _id: string; name: string; email: string; createdAt: string }
  profile: { qualification: string; experienceYears: number; currentLocation: { city: string; state: string } }
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiClient.get("/admin/users/doctors")
        setDoctors(response.data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Registered Doctors</h1>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">No doctors registered yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 font-semibold">Name</th>
                  <th className="text-left py-3 font-semibold">Email</th>
                  <th className="text-left py-3 font-semibold">Qualification</th>
                  <th className="text-left py-3 font-semibold">Experience</th>
                  <th className="text-left py-3 font-semibold">Location</th>
                  <th className="text-left py-3 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.user._id} className="border-b hover:bg-secondary">
                    <td className="py-3">{doctor.user.name}</td>
                    <td className="py-3">{doctor.user.email}</td>
                    <td className="py-3">{doctor.profile?.qualification}</td>
                    <td className="py-3">{doctor.profile?.experienceYears} years</td>
                    <td className="py-3">
                      {doctor.profile?.currentLocation?.city}, {doctor.profile?.currentLocation?.state}
                    </td>
                    <td className="py-3 text-xs text-foreground/60">
                      {new Date(doctor.user.createdAt).toLocaleDateString()}
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
