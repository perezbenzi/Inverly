import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'

export const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        <RegisterForm />
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
} 