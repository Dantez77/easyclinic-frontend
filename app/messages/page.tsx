import { MessagesList } from "./components/messages-list"



export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <MessagesList />
      </div>
    </div>
  )
}
