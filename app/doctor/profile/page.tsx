"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"

interface DoctorProfile {
  _id?: string
  fullName: string
  qualification: string
  specialization?: string
  experienceYears: number
  currentLocation: { city: string; state: string }
  preferredLocations: string[]
  expectedSalaryMin: number
  expectedSalaryMax: number
  isOpenToRelocate: boolean
  registrationNumber: string
  cvUrl: string
  profilePhotoUrl: string
}

export default function DoctorProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<DoctorProfile>({
    fullName: user?.name || "",
    qualification: "BDS",
    specialization: "",
    experienceYears: 0,
    currentLocation: { city: "", state: "" },
    preferredLocations: [],
    expectedSalaryMin: 0,
    expectedSalaryMax: 0,
    isOpenToRelocate: false,
    registrationNumber: "",
    cvUrl: "",
    profilePhotoUrl: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/doctors/me")
        setProfile(response.data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (name.startsWith("currentLocation.")) {
      const key = name.split(".")[1]
      setProfile((prev) => ({
        ...prev,
        currentLocation: { ...prev.currentLocation, [key]: value },
      }))
    } else if (type === "checkbox") {
      setProfile((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await apiClient.put("/doctors/me", profile)
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error saving profile")
      console.error("Error:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {message}
        </div>
      )}

      <Card className="p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Qualification</label>
            <select
              name="qualification"
              value={profile.qualification}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="BDS">BDS</option>
              <option value="MDS">MDS</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {profile.qualification === "MDS" && (
            <div>
              <label className="block text-sm font-medium mb-2">Specialization</label>
              <select
                name="specialization"
                value={profile.specialization || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="">Select specialization</option>
                <option value="Endodontics">Endodontics</option>
                <option value="Orthodontics">Orthodontics</option>
                <option value="Oral Surgery">Oral Surgery</option>
                <option value="Prosthodontics">Prosthodontics</option>
                <option value="Periodontics">Periodontics</option>
                <option value="Pedodontics">Pedodontics</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              name="experienceYears"
              value={profile.experienceYears}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current City</label>
            <input
              type="text"
              name="currentLocation.city"
              value={profile?.currentLocation?.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current State</label>
            <input
              type="text"
              name="currentLocation.state"
              value={profile.currentLocation.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expected Salary Min (in thousands)</label>
            <input
              type="number"
              name="expectedSalaryMin"
              value={profile.expectedSalaryMin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expected Salary Max (in thousands)</label>
            <input
              type="number"
              name="expectedSalaryMax"
              value={profile.expectedSalaryMax}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={profile.registrationNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">CV URL</label>
            <input
              type="text"
              name="cvUrl"
              value={profile.cvUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="https://example.com/your-cv.pdf"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isOpenToRelocate"
              checked={profile.isOpenToRelocate}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Open to relocation</span>
          </label>
        </div>

        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </Card>
    </div>
  )
}
