"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Stats {
  totalDoctors: number
  totalClinics: number
  totalJobs: number
  totalApplications: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalDoctors: 0,
    totalClinics: 0,
    totalJobs: 0,
    totalApplications: 0,
  })
  const [jobsByCity, setJobsByCity] = useState([])
  const [appsByStatus, setAppsByStatus] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes, appsRes] = await Promise.all([
          apiClient.get("/admin/stats/overview"),
          apiClient.get("/admin/stats/jobs-by-city"),
          apiClient.get("/admin/stats/applications-by-status"),
        ])

        setStats(statsRes.data)
        setJobsByCity(jobsRes.data)
        setAppsByStatus(appsRes.data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Doctors</p>
          <p className="text-4xl font-bold text-blue-600">{stats.totalDoctors}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Clinics</p>
          <p className="text-4xl font-bold text-green-600">{stats.totalClinics}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Jobs</p>
          <p className="text-4xl font-bold text-yellow-600">{stats.totalJobs}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-foreground/60 mb-2">Total Applications</p>
          <p className="text-4xl font-bold text-purple-600">{stats.totalApplications}</p>
        </Card>
      </div>

      {!loading && (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Jobs by City */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Jobs by City</h2>
            {jobsByCity.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobsByCity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Applications by Status */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Applications by Status</h2>
            {appsByStatus.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={appsByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                    {appsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
