import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Mail, Loader } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/Button'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link. Please check your email again.')
        return
      }

      try {
        const response = await authService.verifyEmail(token)
        setStatus('success')
        setMessage(response.message || 'Email verified successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (err) {
        setStatus('error')
        setMessage(
          err.response?.data?.error ||
          err.message ||
          'Email verification failed. The link may have expired.'
        )
      }
    }

    verifyEmail()
  }, [token, navigate])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader className="w-12 h-12 text-primary" />
          </motion.div>
          <p className="text-lg font-medium text-text-primary">
            Verifying your email...
          </p>
          <p className="text-text-secondary mt-2">
            Please wait while we confirm your email address
          </p>
        </motion.div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Email Verified!
          </h1>

          {/* Message */}
          <p className="text-text-secondary mb-8">
            {message}
          </p>

          {/* Redirect Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-lg bg-bg-secondary mb-8"
          >
            <p className="text-sm text-text-secondary">
              Redirecting to login in a few seconds...
            </p>
          </motion.div>

          {/* Manual Button */}
          <Link to="/login">
            <Button>
              Go to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">
          Verification Failed
        </h1>

        {/* Message */}
        <p className="text-text-secondary mb-8 text-center">
          {message}
        </p>

        {/* What to do */}
        <div className="bg-bg-secondary rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-text-primary mb-3">What you can do:</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Try clicking the link again if you just received the email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Request a new verification email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Check your spam or promotions folder</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link to="/register" className="block">
            <Button className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Request New Link
            </Button>
          </Link>
          <Link to="/login" className="block">
            <Button variant="secondary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
