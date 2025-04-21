import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        <LoginForm />
        <p className="text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
} 