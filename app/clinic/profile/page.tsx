"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"

interface ClinicProfile {
  _id?: string
  clinicName: string
  type: "clinic" | "hospital"
  address: string
  city: string
  state: string
  pincode: string
  contactPersonName: string
  contactNumber: string
  email: string
  website: string
  description: string
  numberOfChairsOrBeds: number
  specializations: string[]
  logoUrl: string
}

const SPECIALIZATIONS = [
  "Endodontics",
  "Orthodontics",
  "Oral Surgery",
  "Prosthodontics",
  "Periodontics",
  "Pedodontics",
  "Implantology",
  "Cosmetic Dentistry",
]

export default function ClinicProfilePage() {
  const [profile, setProfile] = useState<ClinicProfile>({
    clinicName: "",
    type: "clinic",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactPersonName: "",
    contactNumber: "",
    email: "",
    website: "",
    description: "",
    numberOfChairsOrBeds: 0,
    specializations: [],
    logoUrl: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/clinics/me")
        setProfile(response.data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const toggleSpecialization = (spec: string) => {
    setProfile((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await apiClient.put("/clinics/me", profile)
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
      <h1 className="text-3xl font-bold mb-8">Your Clinic Profile</h1>

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
            <label className="block text-sm font-medium mb-2">Clinic/Hospital Name</label>
            <input
              type="text"
              name="clinicName"
              value={profile.clinicName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              name="type"
              value={profile.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="clinic">Clinic</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Person Name</label>
            <input
              type="text"
              name="contactPersonName"
              value={profile.contactPersonName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={profile.contactNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={profile.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <input
              type="text"
              name="state"
              value={profile.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={profile.pincode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Chairs/Beds</label>
            <input
              type="number"
              name="numberOfChairsOrBeds"
              value={profile.numberOfChairsOrBeds}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              value={profile.logoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-4">Specializations</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SPECIALIZATIONS.map((spec) => (
              <label key={spec} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.specializations.includes(spec)}
                  onChange={() => toggleSpecialization(spec)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{spec}</span>
              </label>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </Card>
    </div>
  )
}
