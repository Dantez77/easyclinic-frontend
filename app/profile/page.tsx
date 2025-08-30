"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import AvailabilityManager from "./components/availability-manager"
import { useDoctorProfile } from "@/hooks/use-doctor-profile"
import { DoctorProfile } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"

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
  const { doctorProfile, isLoading, error, refreshDoctorProfile, updateDoctorProfile, isUpdating } = useDoctorProfile()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null) // For loading timeout

  const [formData, setFormData] = useState<Partial<DoctorProfile>>({})
  const [originalData, setOriginalData] = useState<Partial<DoctorProfile>>({})

  // Safety mechanism: if loading takes too long, force refresh
  useEffect(() => {
    if (isLoading && !loadingTimeout) {
      const timeout = setTimeout(() => {
        console.log('Loading timeout reached, forcing refresh...')
        refreshDoctorProfile()
      }, 10000) // 10 seconds timeout
      setLoadingTimeout(timeout)
    } else if (!isLoading && loadingTimeout) {
      clearTimeout(loadingTimeout)
      setLoadingTimeout(null)
    }
  }, [isLoading, loadingTimeout, refreshDoctorProfile])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
    }
  }, [loadingTimeout])

  // Update form data when profile is loaded
  useEffect(() => {
    console.log('Profile data loaded:', doctorProfile)
    if (doctorProfile && doctorProfile.name && Object.keys(formData).length === 0) {
      setFormData(doctorProfile)
      setOriginalData(doctorProfile)
    }
  }, [doctorProfile, formData])

  // Fallback: if profile data becomes invalid, try to refresh
  useEffect(() => {
    if (doctorProfile && !doctorProfile.name && !isLoading) {
      console.log('Profile data invalid, attempting refresh...')
      refreshDoctorProfile()
    }
  }, [doctorProfile, isLoading, refreshDoctorProfile])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: keyof Pick<DoctorProfile, 'education' | 'specializations' | 'languages' | 'hospitalAffiliations'>, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[])?.map((item: string, i: number) => (i === index ? value : item)) || [],
    }))
  }

  const handleSave = async () => {
    try {
      console.log('Starting profile update with data:', formData)
      const result = await updateDoctorProfile(formData)
      console.log('Update result:', result)
      
      if (result.success) {
        setOriginalData(formData)
        setIsEditing(false)
        toast({
          title: t('profile.toast.success.title'),
          description: t('profile.toast.success.description'),
        })
        console.log('Profile update completed successfully')
      } else {
        toast({
          title: t('profile.toast.error.title'),
          description: result.error || t('profile.toast.error.description'),
          variant: "destructive",
        })
        console.log('Profile update failed:', result.error)
      }
    } catch (error) {
      console.error('Unexpected error during profile update:', error)
      toast({
        title: t('profile.toast.error.title'),
        description: t('profile.toast.error.unexpected'),
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  // Loading state or incomplete data
  if (isLoading || !doctorProfile) { // Simplified check
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-28 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-destructive text-lg font-semibold">
                {t('profile.error.loading')}
              </div>
              <p className="text-muted-foreground">
                {error}
              </p>
              <Button onClick={refreshDoctorProfile}>
                {t('profile.error.retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {t('profile.title')}
                </h1>
                <p className="text-muted-foreground">
                  {t('profile.subtitle')}
                </p>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                    {t('profile.actions.edit')}
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} className="flex items-center gap-2" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('profile.actions.saving')}
                        </>
                      ) : (
                        <>
                          {t('profile.actions.save')}
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 bg-transparent" disabled={isUpdating}>
                      {t('profile.actions.cancel')}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={doctorProfile.avatar?.imageUrl} alt={doctorProfile.name || t('profile.avatar.alt')} />
                  <AvatarFallback className="text-2xl">
                    {doctorProfile.avatar?.initials || (doctorProfile.name ? doctorProfile.name.split(' ').map(n => n[0]).join('') : 'DR')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="w-full">
                    {t('profile.avatar.change')}
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('profile.name.label')}</label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={t('profile.name.placeholder')}
                        className="text-2xl font-bold h-12"
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('profile.specialty.label')}</label>
                      <Input
                        value={formData.specialty || ''}
                        onChange={(e) => handleInputChange("specialty", e.target.value)}
                        placeholder={t('profile.specialty.placeholder')}
                        className="text-lg"
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="acceptingPatients"
                          checked={formData.acceptingNewPatients || false}
                          onChange={(e) => handleInputChange("acceptingNewPatients", e.target.checked)}
                          disabled={isUpdating}
                        />
                        <label htmlFor="acceptingPatients" className="text-sm">{t('profile.badges.acceptingPatients')}</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="boardCertified"
                          checked={formData.isBoardCertified || false}
                          onChange={(e) => handleInputChange("isBoardCertified", e.target.checked)}
                          disabled={isUpdating}
                        />
                        <label htmlFor="boardCertified" className="text-sm">{t('profile.badges.boardCertified')}</label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('profile.info.yearsInPractice')}</label>
                      <Input
                        value={formData.yearsInPractice || ''}
                        onChange={(e) => handleInputChange("yearsInPractice", e.target.value)}
                        placeholder={t('profile.info.yearsInPracticePlaceholder')}
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">
                      {doctorProfile.name || t('profile.name.placeholder')}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {doctorProfile.specialty || t('profile.specialty.placeholder')}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {doctorProfile.isBoardCertified ? t('profile.badges.boardCertified') : t('profile.badges.notBoardCertified')}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {doctorProfile.acceptingNewPatients ? t('profile.badges.acceptingPatients') : t('profile.badges.notAcceptingPatients')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('profile.info.yearsInPractice')}:</span>
                    <span>{doctorProfile.yearsInPractice || t('profile.info.notSpecified')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('profile.info.location')}:</span>
                    <span>{doctorProfile.location?.address || t('profile.info.notSpecified')}</span>
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
                  {t('profile.about.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div>
                    <Label htmlFor="bio">{t('profile.bio.title')}</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder={t('profile.bio.placeholder')}
                      className="mt-2"
                      disabled={isUpdating}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {doctorProfile.bio || t('profile.bio.notProvided')}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      {t('profile.education.title')}
                    </h4>
                    {isEditing ? (
                      <div className="space-y-2">
                        {(formData.education || []).map((edu, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={edu}
                              onChange={(e) => handleArrayChange("education", index, e.target.value)}
                              className="text-sm flex-1"
                              disabled={isUpdating}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newEducation = (formData.education || []).filter((_, i) => i !== index)
                                handleInputChange("education", newEducation)
                              }}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              disabled={isUpdating}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange("education", [...(formData.education || []), ""])}
                          disabled={isUpdating}
                        >
                          {t('profile.education.add')}
                        </Button>
                      </div>
                    ) : (
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {doctorProfile.education && doctorProfile.education.length > 0 ? (
                          doctorProfile.education.map((edu, index) => (
                            <li key={index}>• {edu}</li>
                          ))
                        ) : (
                          <li className="text-muted-foreground">{t('profile.education.notProvided')}</li>
                        )}
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      {t('profile.specializations.title')}
                    </h4>
                    {isEditing ? (
                      <div className="space-y-2">
                        {(formData.specializations || []).map((spec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={spec}
                              onChange={(e) => handleArrayChange("specializations", index, e.target.value)}
                              className="text-sm flex-1"
                              disabled={isUpdating}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSpecializations = (formData.specializations || []).filter((_, i) => i !== index)
                                handleInputChange("specializations", newSpecializations)
                              }}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              disabled={isUpdating}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange("specializations", [...(formData.specializations || []), ""])}
                          disabled={isUpdating}
                        >
                          {t('profile.specializations.add')}
                        </Button>
                      </div>
                    ) : (
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {doctorProfile.specializations && doctorProfile.specializations.length > 0 ? (
                          doctorProfile.specializations.map((spec, index) => (
                            <li key={index}>• {spec}</li>
                          ))
                        ) : (
                          <li className="text-muted-foreground">{t('profile.specializations.notProvided')}</li>
                        )}
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
                  {t('profile.reviews.title')}
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
                <CardTitle className="text-lg">{t('profile.quickInfo.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('profile.quickInfo.languages')}:</span>
                  {isEditing ? (
                    <div className="w-32">
                      <div className="space-y-2">
                        {(formData.languages || []).map((lang, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Input
                              value={lang}
                              onChange={(e) => handleArrayChange("languages", index, e.target.value)}
                              className="h-8 text-xs"
                              disabled={isUpdating}
                              placeholder={t('profile.quickInfo.languagePlaceholder')}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newLanguages = (formData.languages || []).filter((_, i) => i !== index)
                                handleInputChange("languages", newLanguages)
                              }}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              disabled={isUpdating}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange("languages", [...(formData.languages || []), ""])}
                          className="h-8 w-full text-xs"
                          disabled={isUpdating}
                        >
                          {t('profile.quickInfo.addLanguage')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <span>
                      {doctorProfile.languages && doctorProfile.languages.length > 0 
                        ? doctorProfile.languages.join(', ') 
                        : t('profile.quickInfo.notProvided')}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('profile.quickInfo.hospitalAffiliations')}:</span>
                  {isEditing ? (
                    <div className="w-32">
                      <div className="space-y-2">
                        {(formData.hospitalAffiliations || []).map((hospital, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Input
                              value={hospital}
                              onChange={(e) => handleArrayChange("hospitalAffiliations", index, e.target.value)}
                              className="h-8 text-xs"
                              disabled={isUpdating}
                              placeholder={t('profile.quickInfo.hospitalPlaceholder')}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newHospitals = (formData.hospitalAffiliations || []).filter((_, i) => i !== index)
                                handleInputChange("hospitalAffiliations", newHospitals)
                              }}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              disabled={isUpdating}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange("hospitalAffiliations", [...(formData.hospitalAffiliations || []), ""])}
                          className="h-8 w-full text-xs"
                          disabled={isUpdating}
                        >
                          {t('profile.quickInfo.addHospital')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <span>
                      {doctorProfile.hospitalAffiliations && doctorProfile.hospitalAffiliations.length > 0 
                        ? doctorProfile.hospitalAffiliations.join(', ') 
                        : t('profile.quickInfo.notProvided')}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('profile.quickInfo.yearsInPractice')}:</span>
                  {isEditing ? (
                    <Input
                      value={formData.yearsInPractice || ''}
                      onChange={(e) => handleInputChange("yearsInPractice", e.target.value)}
                      className="h-8 w-32"
                      disabled={isUpdating}
                    />
                  ) : (
                    <span>{doctorProfile.yearsInPractice || t('profile.quickInfo.notProvided')}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('profile.quickInfo.gender')}:</span>
                  {isEditing ? (
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="h-8 w-32 rounded border border-input bg-background px-2"
                      disabled={isUpdating}
                    >
                      <option value="">{t('profile.quickInfo.selectGender')}</option>
                      <option value="Female">{t('profile.quickInfo.gender.female')}</option>
                      <option value="Male">{t('profile.quickInfo.gender.male')}</option>
                    </select>
                  ) : (
                    <span>{doctorProfile.gender || t('profile.quickInfo.notProvided')}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  {t('profile.contact.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('profile.contact.phone')}</label>
                    {isEditing ? (
                      <Input
                        value={formData.contact?.phone || ''}
                        onChange={(e) => handleInputChange("contact", { ...formData.contact, phone: e.target.value })}
                        placeholder={t('profile.contact.phonePlaceholder')}
                        disabled={isUpdating}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {doctorProfile.contact?.phone || t('profile.contact.notProvided')}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('profile.contact.email')}</label>
                    {isEditing ? (
                      <Input
                        value={formData.contact?.email || ''}
                        onChange={(e) => handleInputChange("contact", { ...formData.contact, email: e.target.value })}
                        placeholder={t('profile.contact.emailPlaceholder')}
                        disabled={isUpdating}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {doctorProfile.contact?.email || t('profile.contact.notProvided')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('profile.contact.address')}</label>
                  {isEditing ? (
                    <Input
                      value={formData.location?.address || ''}
                      onChange={(e) => handleInputChange("location", { ...formData.location, address: e.target.value })}
                      placeholder={t('profile.contact.addressPlaceholder')}
                      disabled={isUpdating}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {doctorProfile.location?.address || t('profile.contact.notProvided')}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('profile.contact.officeHours')}</label>
                  {isEditing ? (
                    <Input
                      value={formData.officeHours || ''}
                      onChange={(e) => handleInputChange("officeHours", e.target.value)}
                      placeholder={t('profile.contact.officeHoursPlaceholder')}
                      disabled={isUpdating}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {doctorProfile.officeHours || t('profile.contact.notProvided')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Management Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t('profile.schedule.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => setShowAvailabilityManager(true)}
                >
                  {t('profile.schedule.manageAvailability')}
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
