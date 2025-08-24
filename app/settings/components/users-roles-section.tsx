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

// User interface
interface User {
  id: string
  name: string
  email: string
  roles: string[]
  status: 'active' | 'inactive'
  lastLogin?: string
  avatar?: string
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Roberto Martínez",
    email: "roberto@clinica.com",
    roles: ["Administrator", "Doctor"],
    status: "active",
    lastLogin: "2024-01-15 10:30",
    avatar: "RM"
  },
  {
    id: "2",
    name: "Dra. María González",
    email: "maria@clinica.com",
    roles: ["Doctor"],
    status: "active",
    lastLogin: "2024-01-15 09:15",
    avatar: "MG"
  },
  {
    id: "3",
    name: "Ana Rodríguez",
    email: "ana@clinica.com",
    roles: ["Secretary"],
    status: "active",
    lastLogin: "2024-01-15 08:45",
    avatar: "AR"
  }
]

export function UsersRolesSection() {
  const { t } = useLanguage()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    roles: [] as string[],
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [resetPassword, setResetPassword] = useState('')

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.roles.length > 0 && newUser.password) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles,
        status: 'active',
        avatar: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
      }
      setUsers([...users, user])
      setNewUser({ name: '', email: '', roles: [], password: '' })
      setIsAddUserOpen(false)
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

  const handleRoleToggle = (role: string) => {
    setNewUser(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }))
  }

  const handleEditRoleToggle = (role: string) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        roles: selectedUser.roles.includes(role)
          ? selectedUser.roles.filter(r => r !== role)
          : [...selectedUser.roles, role]
      })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("settings.users.addUser")}</DialogTitle>
              <DialogDescription>
                {t("settings.users.addUserDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {t("settings.users.form.name")}
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  {t("settings.users.form.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  {t("settings.users.form.roles")}
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="role-admin"
                      checked={newUser.roles.includes('Administrator')}
                      onChange={() => handleRoleToggle('Administrator')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="role-admin">{t("settings.users.roles.admin.title")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="role-doctor"
                      checked={newUser.roles.includes('Doctor')}
                      onChange={() => handleRoleToggle('Doctor')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="role-doctor">{t("settings.users.roles.doctor.title")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="role-secretary"
                      checked={newUser.roles.includes('Secretary')}
                      onChange={() => handleRoleToggle('Secretary')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="role-secretary">{t("settings.users.roles.secretary.title")}</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  {t("settings.users.form.password")}
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
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
              <Button type="submit" onClick={handleAddUser}>
                {t("settings.users.addUser")}
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
                    <span className="text-sm font-medium text-primary">{user.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.lastLogin && (
                      <p className="text-xs text-muted-foreground">
                        {t("settings.users.lastLogin")}: {user.lastLogin}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant={getRoleBadgeVariant(role)}>
                        {role}
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
                            {t("settings.users.deleteUser.description")} {user.name}?
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  {t("settings.users.form.name")}
                </Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  {t("settings.users.form.email")}
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  {t("settings.users.form.roles")}
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-role-admin"
                      checked={selectedUser.roles.includes('Administrator')}
                      onChange={() => handleEditRoleToggle('Administrator')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="edit-role-admin">{t("settings.users.roles.admin.title")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-role-doctor"
                      checked={selectedUser.roles.includes('Doctor')}
                      onChange={() => handleEditRoleToggle('Doctor')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="edit-role-doctor">{t("settings.users.roles.doctor.title")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-role-secretary"
                      checked={selectedUser.roles.includes('Secretary')}
                      onChange={() => handleEditRoleToggle('Secretary')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="edit-role-secretary">{t("settings.users.roles.secretary.title")}</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  {t("settings.users.form.status")}
                </Label>
                <Select value={selectedUser.status} onValueChange={(value: 'active' | 'inactive') => setSelectedUser({...selectedUser, status: value})}>
                  <SelectTrigger className="col-span-3">
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
              {t("settings.users.passwordReset.description")} {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                {t("settings.users.passwordReset.newPassword")}
              </Label>
              <div className="col-span-3 relative">
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
