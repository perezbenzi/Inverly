import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md px-6">
        <div className="space-y-6">
          <LoginForm />
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-primary hover:text-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 