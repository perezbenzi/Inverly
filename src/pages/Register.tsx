import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'
import { Logo } from '../components/ui/logo'

export const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md space-y-4">
        <Logo />
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
} 