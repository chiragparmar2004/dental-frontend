"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface Clinic {
  user: { _id: string; name: string; email: string; createdAt: string }
  profile: { type: string; city: string; state: string; specializations: string[] }
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await apiClient.get("/admin/users/clinics")
        setClinics(response.data)
      } catch (error) {
        console.error("Error fetching clinics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClinics()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Registered Clinics/Hospitals</h1>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : clinics.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">No clinics registered yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 font-semibold">Name</th>
                  <th className="text-left py-3 font-semibold">Email</th>
                  <th className="text-left py-3 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Location</th>
                  <th className="text-left py-3 font-semibold">Specializations</th>
                  <th className="text-left py-3 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.user._id} className="border-b hover:bg-secondary">
                    <td className="py-3">{clinic.user.name}</td>
                    <td className="py-3">{clinic.user.email}</td>
                    <td className="py-3 capitalize">{clinic.profile?.type}</td>
                    <td className="py-3">
                      {clinic.profile?.city}, {clinic.profile?.state}
                    </td>
                    <td className="py-3 text-xs">
                      <div className="flex gap-1 flex-wrap">
                        {clinic.profile?.specializations?.slice(0, 3).map((spec, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-xs text-foreground/60">
                      {new Date(clinic.user.createdAt).toLocaleDateString()}
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
