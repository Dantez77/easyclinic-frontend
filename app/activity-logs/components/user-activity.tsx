"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

interface UserActivity {
  user: string
  role: string
  actions: number
  lastActivity: string
}

interface UserActivityProps {
  userActivity: UserActivity[]
}

export function UserActivity({ userActivity }: UserActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad por Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userActivity.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{user.user}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{user.actions} acciones</p>
                <p className="text-xs text-muted-foreground">
                  Última: {format(new Date(user.lastActivity), "dd/MM HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
