"use client"

import * as React from "react"
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Stethoscope,
  Heart,
  Shield,
  Award,
  Search,
  Moon,
  Sun,
  ChevronRight,
  Globe,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


const doctors = [
  {
    name: "Dr. Mauricio Ernesto Santamaría",
    specialty: "Coloproctologo, Cirugía y Laparoscopia",
    experience: "20 años",
    education: " Universidad Evangélica de El Salvador",
    image: "/Mauricio.png",
    bio: "Coloproctologo, Cirugía y Laparoscopia JVPM: 11260 Estudios Superiores Junio-Julio 2012 – Concurrencia en el Servicio de Coloproctología, Centro Privado de Cirugía y Coloproctología \"Dr. Marcelo Fraise\". Marzo-Mayo 2012 – Concurrencia….",
  },
  {
    name: "Dr. Fernando Alfredo Quesada",
    specialty: "Cirujano General y Gastrointestinal",
    experience: "20 años",
    education: "Universidad de El Salvador",
    image: "/Quesada.png",
    bio: "Cirujano General y Gastrointestinal – Cirugía Laparoscópica de Avanzada – Cirugía Bariátrica – Balón Intragástrico – Endoscopia Digestiva Diagnóstica y Terapéutica.  Colangio-Pancreatografía Endoscópica Retrógrada (ERCP) – Ultrasonido Endoscopico.",
  },
  {
    name: "Dr. Carlos Zavaleta",
    specialty: "Cirugía de Invasión Mínima y Endoscopía Intervencionista",
    experience: "20 años",
    education: "Universidad Evangélica de El Salvador",
    image: "/zebaleta.png",
    bio: "Cirugía de Invasión Mínima en el manejo de Obesidad Mórbida. Endoscopía Terapéutica. Radio-frequencia en el manejo del Reflujo Gastro-esofágico (STRETTA). Curso de post grado en patologías quirúrgicas de Vía biliar, hígado y páncreas. Curso práctico de Técnicas de sutura en Cirugía Laparoscópica.",
  },
]

const newsArticles = [
  {
    title: "Apendectomía",
    author: "Intergastro El Salvador",
    excerpt: "Procedimiento quirúrgico para extirpar el apéndice inflamado.",
    date: "2024-01-05",
  },
  {
    title: "Colecistectomía",
    author: "Intergastro El Salvador",
    excerpt: "Cirugía para la extracción de la vesícula biliar en casos de cálculos o inflamación.",
    date: "2024-01-05",
  },
  {
    title: "Colonoscopía",
    author: "Intergastro El Salvador",
    excerpt: "Examen endoscópico del colon para diagnóstico y tratamiento de enfermedades digestivas.",
    date: "2024-01-05",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const { language, setLanguage, t } = useLanguage()

  const services = [
    {
      title: t('services.general.title'),
      description: t('services.general.description'),
      icon: Stethoscope,
    },
    {
      title: t('services.cardiology.title'),
      description: t('services.cardiology.description'),
      icon: Heart,
    },
    {
      title: t('services.preventive.title'),
      description: t('services.preventive.description'),
      icon: Shield,
    },
    {
      title: t('services.emergency.title'),
      description: t('services.emergency.description'),
      icon: Award,
    },
  ]

  return (
    <>
      {/* Main Content */}
          {/* Hero Section */}
          <section
            id="home"
            className="bg-gradient-to-r from-main-50 to-white dark:from-main-950 dark:to-background py-16"
          >
            <div className="container px-4">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary dark:text-main-400 mb-4 lg:mb-6">
                    {t('hero.title')}
                  </h1>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-6 lg:mb-8">
                    {t('hero.subtitle')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-primary hover:bg-main-800 text-white w-full sm:w-auto">
                      {t('hero.cta.primary')}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent w-full sm:w-auto"
                    >
                      {t('hero.cta.secondary')}
                    </Button>
                  </div>
                </div>
                <div className="order-1 lg:order-2 relative">
                  <img src="/modern-medical-clinic.png" alt="Medical Clinic" className="rounded-lg shadow-2xl w-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Our Doctors Section */}
          <section id="doctors" className="py-16">
            <div className="container px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-main-400 mb-4">{t('doctors.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('doctors.subtitle')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {doctors.map((doctor, index) => (
                  <Card key={index} className="border-main-200 dark:border-main-800 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <img
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                      <CardTitle className="text-primary dark:text-main-400">{doctor.name}</CardTitle>
                      <CardDescription className="text-lg font-medium">{doctor.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary dark:text-main-400" />
                        <span className="text-sm">{doctor.experience} {t('doctors.experience')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary dark:text-main-400" />
                        <span className="text-sm">{doctor.education}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{doctor.bio}</p>
                      <Button className="w-full bg-primary hover:bg-main-800 text-white">{t('doctors.book')}</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-16 bg-main-50 dark:bg-main-950/20">
            <div className="container px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-main-400 mb-4">{t('services.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('services.subtitle')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {services.map((service, index) => (
                  <Card key={index} className="border-main-200 dark:border-main-800 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <service.icon className="h-12 w-12 text-primary dark:text-main-400 mx-auto mb-4" />
                      <CardTitle className="text-primary dark:text-main-400">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground text-center">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* News Section */}
          <section id="news" className="py-16">
            <div className="container px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-main-400 mb-4">{t('news.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('news.subtitle')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {newsArticles.map((article, index) => (
                  <Card key={index} className="border-main-200 dark:border-main-800 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className="bg-main-100 text-primary dark:bg-main-900 dark:text-main-400"
                        >
                          {article.author}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{article.date}</span>
                      </div>
                      <CardTitle className="text-primary dark:text-main-400">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent"
                      >
                        {t('news.readMore')} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-16 bg-main-50 dark:bg-main-950/20 relative">
            {/* Dark mode background enhancement - matching Contact Us section */}
            <div className="absolute inset-0 hidden dark:block -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-main-900/30 via-main-950/20 to-main-900/30"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,52%,37%,0.08),transparent_50%)]"></div>
            </div>
            <div className="container px-4 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-main-400 mb-4">{t('contact.title')}</h2>
                <p className="text-xl text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto">
                  {t('contact.subtitle')}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary dark:text-main-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-main-400 mb-2">{t('contact.address.title')}</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        {t('contact.address.value').split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary dark:text-main-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-main-400 mb-2">{t('contact.phone.title')}</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        {t('contact.phone.main')}
                        <br />
                        {t('contact.phone.emergency')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary dark:text-main-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-main-400 mb-2">{t('contact.email.title')}</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        {t('contact.email.general')}
                        <br />
                        {t('contact.email.appointments')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary dark:text-main-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-main-400 mb-2">{t('contact.hours.title')}</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        {t('contact.hours.weekdays')}
                        <br />
                        {t('contact.hours.saturday')}
                        <br />
                        {t('contact.hours.sunday')}
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="border-main-200 dark:border-main-800 relative z-10 bg-card dark:bg-card">
                  <CardHeader>
                    <CardTitle className="text-primary dark:text-main-400">{t('contact.form.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder={t('contact.form.firstName')} className="border-main-200 dark:border-main-800 bg-background dark:bg-background" />
                      <Input placeholder={t('contact.form.lastName')} className="border-main-200 dark:border-main-800 bg-background dark:bg-background" />
                    </div>
                    <Input placeholder={t('contact.form.email')} type="email" className="border-main-200 dark:border-main-800 bg-background dark:bg-background" />
                    <Input placeholder={t('contact.form.phone')} type="tel" className="border-main-200 dark:border-main-800 bg-background dark:bg-background" />
                    <textarea
                      placeholder={t('contact.form.message')}
                      rows={4}
                      className="w-full px-3 py-2 border border-main-200 dark:border-main-800 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-main-400 bg-background dark:bg-background text-foreground dark:text-foreground"
                    />
                    <Button className="w-full bg-primary hover:bg-main-800 text-white">{t('contact.form.send')}</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-main-200 dark:border-main-800 py-8">
            <div className="container px-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <img src="/logo2.png" alt="InterGastro Logo" className="h-8 w-auto" />
                  <div className="flex items-center">
                    <span className="font-bold text-[#1E5A96] text-xl">
                      Inter
                    </span>
                    <span className="font-bold text-[#4A90E2] text-xl">
                      Gastro
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {t('footer.copyright')}
                </p>
              </div>
            </div>
          </footer>
    </>
  )
}
