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
import { authApi, User, Role, ClinicUser } from "@/lib/api"
import { useClinicUsers } from "@/hooks/use-clinic-users"
import { Skeleton } from "@/components/ui/skeleton"

// Available roles for selection (this could also come from backend in the future)
const availableRoles = [
  { id: 1, name: "Administrator", description: "Full system access" },
  { id: 2, name: "Doctor", description: "Medical staff access" },
  { id: 3, name: "Secretary", description: "Administrative access" }
]

export function UsersRolesSection() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { clinicUsers, isLoading, error, refreshClinicUsers } = useClinicUsers()
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ClinicUser | null>(null)
  const [isLoadingAction, setIsLoadingAction] = useState(false)
  
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
      setIsLoadingAction(true)
      
      // Debug: Log the request payload
      console.log('Sending user data:', newUser)
      
      try {
        const response = await authApi.register(newUser)

        if (response.data) {
          const createdUser = response.data
          
          // Refresh the clinic users data to show the new user
          await refreshClinicUsers()
          
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
        setIsLoadingAction(false)
      }
    }
  }

  const handleEditUser = (user: ClinicUser) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleUpdateUser = async () => {
    if (selectedUser) {
      setIsLoadingAction(true)
      
      try {
        // Validate required fields
        if (!selectedUser.firstName.trim() || !selectedUser.lastName.trim() || !selectedUser.email.trim()) {
          throw new Error('First name, last name, and email are required fields');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(selectedUser.email)) {
          throw new Error('Please enter a valid email address');
        }

        // Prepare the update data according to the API specification
        const updateData = {
          firstName: selectedUser.firstName.trim(),
          lastName: selectedUser.lastName.trim(),
          email: selectedUser.email.trim(),
          phone: selectedUser.phone?.trim() || '',
          birthDate: selectedUser.birthDate || '',
          active: selectedUser.active
        }

        console.log('Starting user update...')
        console.log('User ID:', selectedUser.id)
        console.log('Update data:', updateData)
        console.log('Current token exists:', !!authApi.updateUser)
        
        const response = await authApi.updateUser(selectedUser.id, updateData)

        console.log('API response received:', response)

        if (response.data) {
          console.log('Update successful, refreshing user list...')
          // Refresh the clinic users data to show the updated user
          await refreshClinicUsers()
          
          // Close the dialog and reset
          setIsEditUserOpen(false)
          setSelectedUser(null)
          
          toast({
            title: t("settings.users.editUser.success"),
            description: `${selectedUser.firstName} ${selectedUser.lastName} has been updated successfully.`,
          })
        } else {
          console.error('API Error Response:', response)
          console.error('Response error:', response.error)
          throw new Error(response.error || 'Failed to update user')
        }
      } catch (error) {
        console.error('Error updating user:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        })
        toast({
          title: t("settings.users.editUser.error"),
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
          variant: "destructive",
        })
      } finally {
        setIsLoadingAction(false)
      }
    }
  }

  const handleDeleteUser = (userId: string) => {
    // In a real implementation, this would call an API to delete the user
    // For now, just refresh the data
    refreshClinicUsers()
  }

  const handlePasswordReset = (user: ClinicUser) => {
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
      case "Administrator":
        return "default"
      case "Doctor":
        return "secondary"
      case "Secretary":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("settings.users.title")}</h2>
          <p className="text-muted-foreground">{t("settings.users.subtitle")}</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={refreshClinicUsers}>{t("settings.users.error.retry")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No data state
  if (!clinicUsers) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("settings.users.title")}</h2>
          <p className="text-muted-foreground">{t("settings.users.subtitle")}</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">{t("settings.users.error.noData")}</p>
              <Button onClick={refreshClinicUsers}>{t("settings.users.error.refresh")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
                      <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinic Information */}
              <div className="space-y-2">
                <Label>Clinic Assignment</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    New users will automatically be assigned to the same clinic as the current user.
                  </p>
                  {clinicUsers.clinic && (
                    <p className="text-sm font-medium mt-1">
                      Clinic: {clinicUsers.clinic.clinic_name} (ID: {clinicUsers.clinic.clinic_id})
                    </p>
                  )}
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
                disabled={isLoadingAction}
              >
                {isLoadingAction ? t("settings.users.form.loading") : t("settings.users.form.submit")}
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
          {/* Clinic Filter Section */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Current Clinic</h4>
                {clinicUsers.clinic ? (
                  <p className="text-sm text-muted-foreground">
                    {clinicUsers.clinic.clinic_name} (ID: {clinicUsers.clinic.clinic_id})
                  </p>
                ) : (
                  <p className="text-muted-foreground">No clinic information available</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Users in this clinic</p>
                <p className="text-lg font-semibold text-primary">{clinicUsers.users.length}</p>
              </div>
            </div>
            {clinicUsers.clinic && (
              <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="text-lg font-semibold">{clinicUsers.users.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                  <p className="text-lg font-semibold text-green-600">
                    {clinicUsers.users.filter(u => u.active).length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Inactive Users</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {clinicUsers.users.filter(u => !u.active).length}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {clinicUsers.users.map((user) => (
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
                    {clinicUsers.clinic && (
                      <p className="text-xs text-primary">
                        {clinicUsers.clinic.clinic_name} (ID: {clinicUsers.clinic.clinic_id})
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role.id} variant={getRoleBadgeVariant(role.name)}>
                        {role.name}
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
                  value={selectedUser.phone || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-birthDate">{t("settings.users.form.birthDate")}</Label>
                <Input
                  id="edit-birthDate"
                  type="date"
                  value={selectedUser.birthDate || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, birthDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.users.form.status")}</Label>
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
            <Button onClick={handleUpdateUser} disabled={isLoadingAction}>
              {isLoadingAction ? t("settings.users.editUser.saving") : t("settings.users.editUser.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordResetOpen} onOpenChange={setIsPasswordResetOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
