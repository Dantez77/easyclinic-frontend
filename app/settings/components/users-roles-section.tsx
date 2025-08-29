"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, Key, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { authApi, User, Role } from "@/lib/api"

// Using imported User and Role types from API

// Mock users data (will be replaced with API calls)
const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Roberto",
    lastName: "Martínez",
    email: "roberto@clinica.com",
    phone: "7777-7777",
    birthDate: "1980-05-15",
    roles: [{ id: 1, name: "Administrator", description: "Full system access", active: true }],
    active: true
  },
  {
    id: "2",
    firstName: "María",
    lastName: "González",
    email: "maria@clinica.com",
    phone: "7777-7778",
    birthDate: "1985-08-22",
    roles: [{ id: 2, name: "Doctor", description: "Medical staff access", active: true }],
    active: true
  },
  {
    id: "3",
    firstName: "Ana",
    lastName: "Rodríguez",
    email: "ana@clinica.com",
    phone: "7777-7779",
    birthDate: "1990-03-10",
    roles: [{ id: 3, name: "Secretary", description: "Administrative access", active: true }],
    active: true
  }
]

// Available roles for selection
const availableRoles = [
  { id: 1, name: "Administrator", description: "Full system access", active: true },
  { id: 2, name: "Doctor", description: "Medical staff access", active: true },
  { id: 3, name: "Secretary", description: "Administrative access", active: true }
]

export function UsersRolesSection() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    roles: [] as number[],
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [resetPassword, setResetPassword] = useState('')

  const handleAddUser = async () => {
    if (newUser.firstName && newUser.lastName && newUser.email && newUser.roles.length > 0 && newUser.password) {
      setIsLoading(true)
      
      // Debug: Log the request payload
      console.log('Sending user data:', newUser)
      
      try {
        const response = await authApi.register(newUser)

        if (response.data) {
          const createdUser = response.data
          
          // Add the new user to the local state
          setUsers([...users, createdUser])
          
          // Reset form
          setNewUser({ firstName: '', lastName: '', email: '', phone: '', birthDate: '', roles: [], password: '' })
          setIsAddUserOpen(false)
          
          toast({
            title: t("settings.users.form.success"),
            description: `${createdUser.firstName} ${createdUser.lastName} has been created successfully.`,
          })
        } else {
          console.error('API Error Response:', response)
          throw new Error(response.error || 'Failed to create user')
        }
      } catch (error) {
        console.error('Error creating user:', error)
        toast({
          title: t("settings.users.form.error"),
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u))
      setIsEditUserOpen(false)
      setSelectedUser(null)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId))
  }

  const handlePasswordReset = (user: User) => {
    setSelectedUser(user)
    setResetPassword('')
    setIsPasswordResetOpen(true)
  }

  const handleResetPassword = () => {
    if (selectedUser && resetPassword) {
      console.log(`Password reset for ${selectedUser.email} to: ${resetPassword}`)
      setIsPasswordResetOpen(false)
      setSelectedUser(null)
      setResetPassword('')
    }
  }

  const handleRoleToggle = (roleId: number) => {
    setNewUser(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId]
    }))
  }

  const handleEditRoleToggle = (roleId: number) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        roles: selectedUser.roles.some(r => r.id === roleId)
          ? selectedUser.roles.filter(r => r.id !== roleId)
          : [...selectedUser.roles, availableRoles.find(r => r.id === roleId)!]
      })
    }
  }

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'Administrator': return 'default'
      case 'Doctor': return 'secondary'
      case 'Secretary': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("settings.users.title")}</h2>
          <p className="text-muted-foreground">{t("settings.users.subtitle")}</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("settings.users.addUser")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("settings.users.addUser")}</DialogTitle>
              <DialogDescription>
                {t("settings.users.addUserDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("settings.users.form.firstName")}</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    placeholder="Juan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("settings.users.form.lastName")}</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    placeholder="Pérez"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t("settings.users.form.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="juan.perez@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("settings.users.form.phone")}</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">{t("settings.users.form.birthDate")}</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={newUser.birthDate}
                    onChange={(e) => setNewUser({...newUser, birthDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("settings.users.form.roles")}</Label>
                <div className="space-y-2">
                  {availableRoles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        checked={newUser.roles.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="rounded border-gray-300"
                      />
                                             <Label htmlFor={`role-${role.id}`}>{role.nombre}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("settings.users.form.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Enter password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAddUser}
                disabled={isLoading}
              >
                {isLoading ? t("settings.users.form.loading") : t("settings.users.form.submit")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.users.userList.title")}</CardTitle>
          <CardDescription>{t("settings.users.userList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role.id} variant={getRoleBadgeVariant(role.nombre)}>
                        {role.nombre}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePasswordReset(user)}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("settings.users.deleteUser.title")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("settings.users.deleteUser.description")} {user.firstName} {user.lastName}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("settings.users.deleteUser.cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t("settings.users.deleteUser.confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("settings.users.editUser.title")}</DialogTitle>
            <DialogDescription>
              {t("settings.users.editUser.description")}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">{t("settings.users.form.firstName")}</Label>
                  <Input
                    id="edit-firstName"
                    value={selectedUser.firstName}
                    onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">{t("settings.users.form.lastName")}</Label>
                  <Input
                    id="edit-lastName"
                    value={selectedUser.lastName}
                    onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">{t("settings.users.form.email")}</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">{t("settings.users.form.phone")}</Label>
                <Input
                  id="edit-phone"
                  value={selectedUser.phone}
                  onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">{t("settings.users.form.status")}</Label>
                <Select value={selectedUser.active ? "active" : "inactive"} onValueChange={(value: 'active' | 'inactive') => setSelectedUser({...selectedUser, active: value === 'active'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("settings.users.status.active")}</SelectItem>
                    <SelectItem value="inactive">{t("settings.users.status.inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateUser}>
              {t("settings.users.editUser.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordResetOpen} onOpenChange={setIsPasswordResetOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("settings.users.passwordReset.title")}</DialogTitle>
            <DialogDescription>
              {t("settings.users.passwordReset.description")} {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">{t("settings.users.passwordReset.newPassword")}</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleResetPassword}>
              {t("settings.users.passwordReset.reset")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.users.roles.title")}</CardTitle>
          <CardDescription>{t("settings.users.roles.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium">{t("settings.users.roles.admin.title")}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-users">{t("settings.users.roles.admin.manageUsers")}</Label>
                <Switch id="admin-users" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-billing">{t("settings.users.roles.admin.billingAccess")}</Label>
                <Switch id="admin-billing" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-reports">{t("settings.users.roles.admin.viewReports")}</Label>
                <Switch id="admin-reports" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-settings">{t("settings.users.roles.admin.settings")}</Label>
                <Switch id="admin-settings" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">{t("settings.users.roles.doctor.title")}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="doctor-patients">{t("settings.users.roles.doctor.managePatients")}</Label>
                <Switch id="doctor-patients" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="doctor-appointments">{t("settings.users.roles.doctor.viewAppointments")}</Label>
                <Switch id="doctor-appointments" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="doctor-prescriptions">{t("settings.users.roles.doctor.prescribeMedications")}</Label>
                <Switch id="doctor-prescriptions" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="doctor-reports">{t("settings.users.roles.doctor.viewMedicalReports")}</Label>
                <Switch id="doctor-reports" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">{t("settings.users.roles.secretary.title")}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="secretary-patients">{t("settings.users.roles.secretary.viewPatients")}</Label>
                <Switch id="secretary-patients" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="secretary-appointments">{t("settings.users.roles.secretary.manageAppointments")}</Label>
                <Switch id="secretary-appointments" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="secretary-billing">{t("settings.users.roles.secretary.viewBilling")}</Label>
                <Switch id="secretary-billing" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="secretary-reports">{t("settings.users.roles.secretary.viewBasicReports")}</Label>
                <Switch id="secretary-reports" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="secretary-phone">{t("settings.users.roles.secretary.phoneAccess")}</Label>
                <Switch id="secretary-phone" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="secretary-email">{t("settings.users.roles.secretary.emailAccess")}</Label>
                <Switch id="secretary-email" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
