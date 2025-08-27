import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Phone } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Message {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  submittedAt: string
}

interface MessageDetailsModalProps {
  message: Message | null
  isOpen: boolean
  onClose: () => void
}

export function MessageDetailsModal({ message, isOpen, onClose }: MessageDetailsModalProps) {
  const { t, language } = useLanguage()

  if (!message) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? "es-SV" : "en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-balance">
                {message.firstName} {message.lastName}
              </DialogTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                {formatDate(message.submittedAt)}
              </div>
            </div>

          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{t('messages.modal.contact.email')}</span>
              <span className="text-muted-foreground">{message.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{t('messages.modal.contact.phone')}</span>
              <span className="text-muted-foreground">{message.phone}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t('messages.modal.message')}</h3>
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
