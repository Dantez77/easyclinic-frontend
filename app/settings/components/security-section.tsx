"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api"
import { useAuthContext } from "@/lib/auth-context"

export function SecuritySection() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { user } = useAuthContext()
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: t("settings.security.password.error.title"),
        description: t("settings.security.password.error.allFieldsRequired"),
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t("settings.security.password.error.title"),
        description: t("settings.security.password.error.passwordsDoNotMatch"),
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: t("settings.security.password.error.title"),
        description: t("settings.security.password.error.passwordTooShort"),
        variant: "destructive",
      })
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast({
        title: t("settings.security.password.error.title"),
        description: t("settings.security.password.error.samePassword"),
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: t("settings.security.password.error.title"),
        description: t("settings.security.password.error.noUser"),
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      console.log('Starting password change...')
      console.log('User ID:', user.id)
      console.log('authApi object:', authApi)
      console.log('authApi.changePassword function:', authApi.changePassword)
      console.log('Current token exists:', !!authApi.changePassword)
      
      // Test if the function exists and can be called
      if (typeof authApi.changePassword !== 'function') {
        throw new Error('authApi.changePassword is not a function')
      }
      
      const response = await authApi.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      console.log('API response received:', response)

      if (response.data) {
        console.log('Password change successful')
        toast({
          title: t("settings.security.password.success.title"),
          description: t("settings.security.password.success.description"),
        })
        
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        console.error('API Error Response:', response)
        console.error('Response error:', response.error)
        
        // Parse specific error messages from the backend
        let errorMessage = response.error || 'Failed to change password'
        
        if (errorMessage.includes('Datos de entrada inválidos') || errorMessage.includes('contraseña actual incorrecta')) {
          errorMessage = t("settings.security.password.error.invalidCurrentPassword")
        } else if (errorMessage.includes('No autorizado') || errorMessage.includes('token JWT inválido')) {
          errorMessage = t("settings.security.password.error.invalidToken")
        } else if (errorMessage.includes('400')) {
          errorMessage = t("settings.security.password.error.badRequest")
        } else if (errorMessage.includes('401')) {
          errorMessage = t("settings.security.password.error.unauthorized")
        }
        
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Error changing password:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      
      toast({
        title: t("settings.security.password.error.title"),
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    console.log('Toggling password visibility for:', field, 'Current state:', showPasswords[field])
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '', bgColor: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    if (score <= 2) return { score, label: t("settings.security.password.strength.weak"), color: 'text-red-500', bgColor: 'bg-red-500' }
    if (score <= 3) return { score, label: t("settings.security.password.strength.fair"), color: 'text-yellow-500', bgColor: 'bg-yellow-500' }
    if (score <= 4) return { score, label: t("settings.security.password.strength.good"), color: 'text-blue-500', bgColor: 'bg-blue-500' }
    return { score, label: t("settings.security.password.strength.strong"), color: 'text-green-500', bgColor: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)

  // Debug logging
  console.log('SecuritySection render - showPasswords:', showPasswords)
  console.log('SecuritySection render - passwordData:', passwordData)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{t("settings.security.title")}</h2>
        <p className="text-muted-foreground">{t("settings.security.subtitle")}</p>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.security.password.title")}</CardTitle>
          <CardDescription>{t("settings.security.password.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t("settings.security.password.current")}</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                placeholder={t("settings.security.password.currentPlaceholder")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 border border-gray-300 dark:border-gray-600"
                aria-label={showPasswords.current ? "Hide password" : "Show password"}
              >
                {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {showPasswords.current && (
              <p className="text-xs text-muted-foreground">Password is visible</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">{t("settings.security.password.new")}</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                placeholder={t("settings.security.password.newPlaceholder")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 border border-gray-300 dark:border-gray-600"
                aria-label={showPasswords.new ? "Hide password" : "Show password"}
              >
                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {showPasswords.new && (
              <p className="text-xs text-muted-foreground">Password is visible</p>
            )}
            {passwordData.newPassword && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{t("settings.security.password.strength.label")}:</span>
                <span className={passwordStrength.color}>{passwordStrength.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 w-8 rounded-full ${
                        level <= passwordStrength.score ? passwordStrength.bgColor : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t("settings.security.password.confirm")}</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                placeholder={t("settings.security.password.confirmPlaceholder")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 border border-gray-300 dark:border-gray-600"
                aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
              >
                {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {showPasswords.confirm && (
              <p className="text-xs text-muted-foreground">Password is visible</p>
            )}
          </div>

          <Button onClick={handleChangePassword} disabled={isChangingPassword}>
            {isChangingPassword ? t("settings.security.password.changing") : t("settings.security.password.change")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.security.2fa.title")}</CardTitle>
          <CardDescription>{t("settings.security.2fa.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa-enabled">{t("settings.security.2fa.enable")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.security.2fa.enableDescription")}</p>
            </div>
            <Switch id="2fa-enabled" />
          </div>

          <div className="space-y-2">
            <Label>{t("settings.security.2fa.method")}</Label>
            <select className="w-full p-2 border rounded-md border-main-200 dark:border-main-800">
              <option value="sms">{t("settings.security.2fa.method.sms")}</option>
              <option value="email">{t("settings.security.2fa.method.email")}</option>
              <option value="app">{t("settings.security.2fa.method.app")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.security.sessions.title")}</CardTitle>
          <CardDescription>{t("settings.security.sessions.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg border-main-200 dark:border-main-800">
              <div>
                <p className="font-medium">{t("settings.security.sessions.chromeWindows")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.security.sessions.chromeWindowsDetails")}</p>
              </div>
              <Badge variant="secondary">{t("settings.security.sessions.current")}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg border-main-200 dark:border-main-800">
              <div>
                <p className="font-medium">{t("settings.security.sessions.safariIphone")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.security.sessions.safariIphoneDetails")}</p>
              </div>
              <Button variant="outline" size="sm">
                {t("settings.security.sessions.logout")}
              </Button>
            </div>
          </div>

          <Button variant="destructive" size="sm">
            {t("settings.security.sessions.logoutAll")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.security.policies.title")}</CardTitle>
          <CardDescription>{t("settings.security.policies.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-length">{t("settings.security.policies.minLength")}</Label>
              <Input id="min-length" type="number" defaultValue="8" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry-days">{t("settings.security.policies.expiryDays")}</Label>
              <Input id="expiry-days" type="number" defaultValue="90" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-uppercase">{t("settings.security.policies.requireUppercase")}</Label>
              <Switch id="require-uppercase" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-numbers">{t("settings.security.policies.requireNumbers")}</Label>
              <Switch id="require-numbers" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-symbols">{t("settings.security.policies.requireSymbols")}</Label>
              <Switch id="require-symbols" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
