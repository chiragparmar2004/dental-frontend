import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Briefcase, Stethoscope, Building2, BarChart3, CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link 
              href="/" 
              className="text-2xl font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              Dental Recruit
            </Link>
            <nav className="flex items-center gap-4">
              <Link 
                href="/jobs" 
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                Browse Jobs
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground tracking-tight">
              Connect Dental Talent with Opportunity
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Dental Recruit is the premier platform connecting dentists (BDS/MDS) with dental clinics and hospitals
              across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register/doctor">
                <Button size="lg" className="w-full sm:w-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Register as Doctor
                </Button>
              </Link>
              <Link href="/register/clinic">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl">
                  <Building2 className="h-5 w-5 mr-2" />
                  Register as Clinic
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Dental Recruit?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A trusted platform designed for dental professionals
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow border-0 bg-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">For Doctors</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Find jobs matched to your profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Track application status in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Filter by location, qualification & salary</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow border-0 bg-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-secondary/20 text-secondary-foreground">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">For Clinics</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Post unlimited job openings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Manage applicants easily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Update application statuses instantly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Dental Recruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
