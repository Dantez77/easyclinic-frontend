"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import AvailabilityManager from "./components/availability-manager"


import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  GraduationCap,
  Heart,
  Users,
  CheckCircle,
  Edit,
  Save,
  X,
  Camera,
} from "lucide-react"

export default function DoctorEditProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false)

  const [formData, setFormData] = useState({
    name: "Dr. Quesada",
    specialty: "Cirujano General y Gastrointestinal",
    phone: "(503) 7123-4567",
    email: "dr.quesada@clinic.com",
    address: "123 Medical Center Dr, Suite 200",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM",
    bio: "Cirujano General y Gastrointestinal – Cirugía Laparoscópica de Avanzada – Cirugía Bariátrica – Balón Intragástrico – Endoscopia Digestiva Diagnóstica y Terapéutica.  Colangio-Pancreatografía Endoscópica Retrógrada (ERCP) – Ultrasonido Endoscopico.     JVPM: 3847 – CONACEM (CHILE) 6324",
    education: ["MD - Harvard Medical School", "Residency - Johns Hopkins Hospital", "Fellowship - Mayo Clinic"],
    specializations: ["Endoscopia", "Cirugia Digestiva", "Cirugia General", "Cirugia Bariatrica"],
    languages: "English, Spanish",
    hospitalAffiliations: "City General, St. Mary's",
    yearsInPractice: "30+ years",
    gender: "Male",
    acceptingNewPatients: true,
  })

  const [originalData, setOriginalData] = useState(formData)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => (i === index ? value : item)),
    }))
  }

  const handleSave = () => {
    setOriginalData(formData)
    setIsEditing(false)
    // Here you would typically save to a database
    alert("Profile updated successfully!")
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Dr. Martinez is incredibly thorough and caring. She took the time to explain everything and made me feel comfortable throughout my visit.",
      date: "2 weeks ago",
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "Excellent bedside manner and very knowledgeable. The office staff is also wonderful. Highly recommend!",
      date: "1 month ago",
    },
    {
      name: "Emily Rodriguez",
      rating: 4,
      comment: "Great doctor with a lot of experience. Wait times are reasonable and the facility is clean and modern.",
      date: "2 months ago",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <Card className="bg-card border-border">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 bg-transparent">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src="/professional-doctor-headshot.png" alt={formData.name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">MM</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => alert("Photo upload functionality would be implemented here")}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="text-2xl font-bold h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                          id="specialty"
                          value={formData.specialty}
                          onChange={(e) => handleInputChange("specialty", e.target.value)}
                          className="text-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-4xl font-bold text-foreground mb-2">{formData.name}</h1>
                      <p className="text-xl text-muted-foreground mb-4">{formData.specialty}</p>
                    </>
                  )}



                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="acceptingPatients"
                          checked={formData.acceptingNewPatients}
                          onChange={(e) => handleInputChange("acceptingNewPatients", e.target.checked)}
                        />
                        <Label htmlFor="acceptingPatients">Accepting New Patients</Label>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {formData.acceptingNewPatients ? "Accepting New Patients" : "Not Accepting New Patients"}
                      </Badge>
                    )}
                    <Badge variant="outline">Board Certified</Badge>
                    <Badge variant="outline">{formData.yearsInPractice} Experience</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <a href={`tel:${formData.phone}`} className="hover:text-primary">
                        {formData.phone}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <a href={`mailto:${formData.email}`} className="hover:text-primary">
                        {formData.email}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span>{formData.address}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={formData.hours}
                        onChange={(e) => handleInputChange("hours", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span>{formData.hours}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div>
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{formData.bio}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Education
                    </h4>
                    {isEditing ? (
                      <div className="space-y-2">
                        {formData.education.map((edu, index) => (
                          <Input
                            key={index}
                            value={edu}
                            onChange={(e) => handleArrayChange("education", index, e.target.value)}
                            className="text-sm"
                          />
                        ))}
                      </div>
                    ) : (
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {formData.education.map((edu, index) => (
                          <li key={index}>• {edu}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Specializations
                    </h4>
                    {isEditing ? (
                      <div className="space-y-2">
                        {formData.specializations.map((spec, index) => (
                          <Input
                            key={index}
                            value={spec}
                            onChange={(e) => handleArrayChange("specializations", index, e.target.value)}
                            className="text-sm"
                          />
                        ))}
                      </div>
                    ) : (
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {formData.specializations.map((spec, index) => (
                          <li key={index}>• {spec}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Reviews - Read Only */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Patient Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">{review.name}</span>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Languages:</span>
                  {isEditing ? (
                    <Input
                      value={formData.languages}
                      onChange={(e) => handleInputChange("languages", e.target.value)}
                      className="h-8 w-32"
                    />
                  ) : (
                    <span>{formData.languages}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hospital Affiliations:</span>
                  {isEditing ? (
                    <Input
                      value={formData.hospitalAffiliations}
                      onChange={(e) => handleInputChange("hospitalAffiliations", e.target.value)}
                      className="h-8 w-32"
                    />
                  ) : (
                    <span>{formData.hospitalAffiliations}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Years in Practice:</span>
                  {isEditing ? (
                    <Input
                      value={formData.yearsInPractice}
                      onChange={(e) => handleInputChange("yearsInPractice", e.target.value)}
                      className="h-8 w-32"
                    />
                  ) : (
                    <span>{formData.yearsInPractice}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gender:</span>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="h-8 w-32 rounded border border-input bg-background px-2"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <span>{formData.gender}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Management Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Schedule Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => setShowAvailabilityManager(true)}
                >
                  Manage Availability
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  View Appointments
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Block Time Off
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Availability Manager Modal */}
        {showAvailabilityManager && <AvailabilityManager onClose={() => setShowAvailabilityManager(false)}
        />}
      </div>
    </div>
  )
}
