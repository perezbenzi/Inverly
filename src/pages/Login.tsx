import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { Logo } from '../components/ui/logo'
import { Button } from '@/components/ui/button'
import { RequestAccessModal } from '@/components/auth/RequestAccessModal'

export const Login = () => {
  const [showRequestAccess, setShowRequestAccess] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md px-6">
        <div className="space-y-6">
          <Logo />
          <LoginForm />
          <div className="flex flex-col items-center space-y-4 text-sm text-muted-foreground">
            <div>
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="h-auto p-0 text-primary hover:text-primary/90"
                onClick={() => setShowRequestAccess(true)}
              >
                Request Access
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <RequestAccessModal 
        isOpen={showRequestAccess}
        onClose={() => setShowRequestAccess(false)}
      />
    </div>
  )
} 