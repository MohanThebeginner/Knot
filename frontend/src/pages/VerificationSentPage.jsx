import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function VerificationSentPage() {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    let timer
    const expiryTime = localStorage.getItem('verificationExpiry')
    
    if (expiryTime) {
      const calculateTimeLeft = () => {
        const now = Date.now()
        const remaining = Math.floor((parseInt(expiryTime) - now) / 1000)
        
        if (remaining <= 0) {
          setTimeLeft(null)
          localStorage.removeItem('verificationExpiry')
        } else {
          setTimeLeft(remaining)
        }
      }

      calculateTimeLeft()
      timer = setInterval(calculateTimeLeft, 1000)
    }

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Check Your Email
        </h1>

        {/* Message */}
        <p className="text-text-secondary mb-6">
          We've sent a verification link to your email address. Click the link to verify your account and get started!
        </p>

        {/* Steps */}
        <div className="bg-bg-secondary rounded-lg p-6 mb-8 text-left space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-semibold">
              1
            </span>
            <p className="text-text-secondary">Check your email inbox</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-semibold">
              2
            </span>
            <p className="text-text-secondary">Click the verification link</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-semibold">
              3
            </span>
            <p className="text-text-secondary">You'll be ready to login</p>
          </div>
        </div>

        {/* Timer */}
        {timeLeft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
          >
            <div className="flex items-center justify-center gap-2 text-yellow-900 dark:text-yellow-200">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Link expires in <strong>{formatTime(timeLeft)}</strong>
              </span>
            </div>
          </motion.div>
        )}

        {/* Help Text */}
        <p className="text-sm text-text-secondary mb-8">
          Didn't receive the email? Check your spam folder or wait a moment and try again.
        </p>

        {/* Button */}
        <Link to="/login" className="inline-block">
          <Button variant="secondary" className="gap-2">
            Back to Login <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
