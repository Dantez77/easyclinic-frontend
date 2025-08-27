"use client"

import {useMemo, useState} from "react"
import { MessageCard } from "./message-card"
import { MessageDetailsModal } from "./message-details-modal"

import { Button } from "@/components/ui/button"
import {MessagesHeader} from "@/app/messages/components/messages-header";
import { useLanguage } from "@/lib/language-context"

// Mock data for demonstration
const mockMessages = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 7123-4567",
    message:
      "I would like to schedule an appointment for a routine checkup. I have been experiencing some mild headaches recently and would like to discuss this with a doctor.",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "new" as const,
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@email.com",
    phone: "(555) 7987-6543",
    message:
      "Hello, I need to reschedule my appointment that was scheduled for next Tuesday. Please let me know available times for the following week.",
    submittedAt: "2024-01-14T14:15:00Z",
    status: "reviewed" as const,
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "(555) 7456-7890",
    message:
      "I am interested in learning more about your preventive care services. Could someone please contact me to discuss available packages?",
    submittedAt: "2024-01-14T09:45:00Z",
    status: "new" as const,
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Thompson",
    email: "david.thompson@email.com",
    phone: "(555) 7321-0987",
    message:
      "I have a question about my recent lab results. The portal shows they are ready but I cannot access them. Can someone help me with this?",
    submittedAt: "2024-01-13T16:20:00Z",
    status: "reviewed" as const,
  },
  {
    id: "5",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@email.com",
    phone: "(555) 7654-3210",
    message:
      "I would like to request a referral to a specialist for my ongoing back pain. My primary care physician recommended I contact the clinic directly.",
    submittedAt: "2024-01-13T11:10:00Z",
    status: "new" as const,
  },
]

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

export function MessagesList() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredMessages = useMemo(() => {
    let filtered = messages

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (message) =>
          message.firstName.toLowerCase().includes(query) ||
          message.lastName.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((message) => message.status === filterStatus)
    }

    return filtered
  }, [messages, searchQuery, filterStatus])

  const handleClearFilters = () => {
    setSearchQuery("")
    setFilterStatus("all")
  }

  const hasActiveFilters = searchQuery.trim() !== "" || filterStatus !== "all"

  const handleViewDetails = (message: Message) => {
    setSelectedMessage(message)
    setIsModalOpen(true)
  }

  const handleMarkReviewed = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "reviewed" as const } : msg)))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMessage(null)
  }

  const newMessages = filteredMessages.filter((msg) => msg.status === "new")
  const reviewedMessages = filteredMessages.filter((msg) => msg.status === "reviewed")

  return (
    <div className="space-y-8">
      <MessagesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t('messages.noResults')}</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters} className="mt-4 bg-transparent">
              {t('messages.clearFilters')}
            </Button>
          )}
        </div>
      )}

      {(filterStatus === "all" || filterStatus === "new") && newMessages.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-foreground">{t('messages.sections.new')}</h2>
            <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium">
              {newMessages.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {newMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onViewDetails={handleViewDetails}
                onMarkReviewed={handleMarkReviewed}
              />
            ))}
          </div>
        </div>
      )}

      {(filterStatus === "all" || filterStatus === "reviewed") && reviewedMessages.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-foreground">{t('messages.sections.reviewed')}</h2>
            <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm font-medium">
              {reviewedMessages.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviewedMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onViewDetails={handleViewDetails}
                onMarkReviewed={handleMarkReviewed}
              />
            ))}
          </div>
        </div>
      )}

      <MessageDetailsModal message={selectedMessage} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

