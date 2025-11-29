"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"

interface JobForm {
  title: string
  qualificationRequired: string
  specializationRequired: string
  jobType: string
  minExperienceYears: number
  salaryRange: { min: number; max: number }
  city: string
  state: string
  description: string
  shifts: string
  workingDays: string
}

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState<JobForm>({
    title: "",
    qualificationRequired: "Any",
    specializationRequired: "",
    jobType: "full-time",
    minExperienceYears: 0,
    salaryRange: { min: 0, max: 0 },
    city: "",
    state: "",
    description: "",
    shifts: "",
    workingDays: "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("salaryRange.")) {
      const key = name.split(".")[1]
      setForm((prev) => ({
        ...prev,
        salaryRange: { ...prev.salaryRange, [key]: Number(value) },
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === "minExperienceYears" ? Number(value) : value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.title || !form.city || !form.state || !form.description) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)
      await apiClient.post("/jobs", form)
      router.push("/clinic/jobs")
    } catch (err) {
      setError("Error creating job. Please try again.")
      console.error("Error:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>

      {error && <div className="mb-6 px-4 py-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="e.g., Senior BDS Doctor"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type *</label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="locum">Locum</option>
                <option value="consultant">Consultant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Qualification Required</label>
              <select
                name="qualificationRequired"
                value={form.qualificationRequired}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="Any">Any</option>
                <option value="BDS">BDS</option>
                <option value="MDS">MDS</option>
              </select>
            </div>

            {form.qualificationRequired === "MDS" && (
              <div>
                <label className="block text-sm font-medium mb-2">Specialization</label>
                <select
                  name="specializationRequired"
                  value={form.specializationRequired}
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
              <label className="block text-sm font-medium mb-2">Minimum Experience (years)</label>
              <input
                type="number"
                name="minExperienceYears"
                value={form.minExperienceYears}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">State *</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salary Min (in thousands)</label>
              <input
                type="number"
                name="salaryRange.min"
                value={form.salaryRange.min}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salary Max (in thousands)</label>
              <input
                type="number"
                name="salaryRange.max"
                value={form.salaryRange.max}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="Describe the job, responsibilities, and requirements..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Shifts/Timing</label>
              <input
                type="text"
                name="shifts"
                value={form.shifts}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="e.g., 9 AM - 6 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Working Days</label>
              <input
                type="text"
                name="workingDays"
                value={form.workingDays}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="e.g., Monday to Friday"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
              {saving ? "Posting..." : "Post Job"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
