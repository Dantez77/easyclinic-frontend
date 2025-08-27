"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Phone, Eye, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Message {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  submittedAt: string
  status: "new" | "reviewed"
}

interface MessageCardProps {
  message: Message
  onViewDetails: (message: Message) => void
  onMarkReviewed: (messageId: string) => void
}

export function MessageCard({ message, onViewDetails, onMarkReviewed }: MessageCardProps) {
  const { t, language } = useLanguage()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? "es-SV" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateMessage = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground text-balance">
              {message.firstName} {message.lastName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3 w-3" />
              {formatDate(message.submittedAt)}
            </div>
          </div>
          <Badge
            variant={message.status === "new" ? "default" : "secondary"}
            className={message.status === "new" ? "bg-accent text-accent-foreground" : ""}
          >
            {message.status === "new" ? t('messages.status.new') : t('messages.status.reviewed')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Contact info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{message.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{message.phone}</span>
          </div>
        </div>

        {/* Message area (flexible) */}
        <div className="flex-1 bg-muted/50 p-3 rounded-md overflow-hidden">
          <p className="text-sm text-card-foreground leading-relaxed line-clamp-5">
            {truncateMessage(message.message)}
          </p>
        </div>

        {/* Buttons pinned at bottom */}
        <div className="flex gap-2 pt-2 mt-auto">
          <Button size="sm" className="flex-1" onClick={() => onViewDetails(message)}>
            <Eye className="h-3 w-3 mr-1" />
            {t('messages.actions.viewDetails')}
          </Button>
          {message.status === "new" && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => onMarkReviewed(message.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {t('messages.actions.markReviewed')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
