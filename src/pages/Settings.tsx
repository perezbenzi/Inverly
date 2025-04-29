import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Trash2, AlertCircle, KeyRound, Check, ArrowLeft } from 'lucide-react'

export const Settings = () => {
  const { user, deleteAccount, deleteAccountWithReauth, logout, updatePassword } = useAuth()
  const navigate = useNavigate()
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleDeleteAccount = async () => {
    setShowAuthDialog(true)
  }

  const handleDeleteWithReauth = async () => {
    if (!password.trim()) {
      setAuthError('Enter your password')
      return
    }

    try {
      setIsDeleting(true)
      setAuthError('')
      await deleteAccountWithReauth(password)
      navigate('/login')
      toast.success('Your account has been successfully deleted')
    } catch (error: any) {
      console.error('Error deleting account:', error)
      setIsDeleting(false)
      
      if (error.code === 'auth/wrong-password') {
        setAuthError('Incorrect password')
      } else if (error.code === 'auth/too-many-requests') {
        setAuthError('Too many attempts. Try again later')
      } else if (error.code === 'auth/requires-recent-login') {
        setAuthError('For security reasons, you need to log in again')
        try {
          await logout()
          navigate('/login')
        } catch {
          // If logout fails, we continue showing the error
        }
      } else if (error.code === 'auth/network-request-failed') {
        setAuthError('Connection error. Check your internet')
      } else {
        setAuthError('Error verifying your identity')
      }
    }
  }

  const closeAuthDialog = () => {
    setShowAuthDialog(false)
    setPassword('')
    setAuthError('')
  }

  const handleOpenPasswordDialog = () => {
    setShowPasswordDialog(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
  }

  const closePasswordDialog = () => {
    setShowPasswordDialog(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
  }

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      setPasswordError('Enter your current password')
      return
    }
    
    if (!newPassword.trim()) {
      setPasswordError('Enter your new password')
      return
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    
    try {
      setIsChangingPassword(true)
      setPasswordError('')
      await updatePassword(currentPassword, newPassword)
      closePasswordDialog()
      toast.success('Your password has been successfully updated')
    } catch (error: any) {
      console.error('Error changing password:', error)
      setIsChangingPassword(false)
      
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Incorrect current password')
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Password is too weak. Use at least 6 characters')
      } else if (error.code === 'auth/requires-recent-login') {
        setPasswordError('For security reasons, you need to log in again')
        try {
          await logout()
          navigate('/login')
        } catch {
        }
      } else {
        setPasswordError('Error changing password')
      }
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Unauthorized Access</h2>
          <p className="text-muted-foreground">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="h-9 md:h-10"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="border border-border rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-sm text-muted-foreground">
              Options related to your account security
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Change your password to keep your account secure
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenPasswordDialog}
                className="w-full md:w-auto"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="text-sm text-muted-foreground">
              Options related to your user account
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  This action will permanently delete your account and all your data.
                </p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. It will permanently delete your account
                      and all your associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Security Verification</DialogTitle>
            <DialogDescription>
              To protect your account, we need to verify your identity before deleting it.
              Please enter your password to continue.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            
            {authError && (
              <div className="flex items-center text-sm text-destructive space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>{authError}</span>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={closeAuthDialog}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteWithReauth}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and new password to update your account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            {passwordError && (
              <div className="flex items-center text-sm text-destructive space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>{passwordError}</span>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={closePasswordDialog}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Updating...' : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
} 