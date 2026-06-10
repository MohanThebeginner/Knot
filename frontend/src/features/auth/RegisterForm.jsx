import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function RegisterForm() {
  const { register } = useAuth()
  const toast        = useToast()
  const navigate     = useNavigate()

  const [fields, setFields]   = useState({ username: '', email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (serverError)  setServerError('')
  }

  function validate() {
    const errs = {}

    if (!fields.username.trim()) {
      errs.username = 'Username is required'
    } else if (fields.username.length > 30) {
      errs.username = 'Username must be 30 characters or fewer'
    }

    if (!fields.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = 'Enter a valid email address'
    }

    if (!fields.password) {
      errs.password = 'Password is required'
    } else if (fields.password.length < 8) {
      errs.password = 'Password must be at least 8 characters'
    }

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      await register({
        username: fields.username.trim(),
        email:    fields.email.trim().toLowerCase(),
        password: fields.password,
      })
      // Set verification link expiry (24 hours from now)
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000
      localStorage.setItem('verificationExpiry', expiryTime.toString())
      
      toast.success('Account created! Check your email to verify.')
      navigate('/verification-sent')
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(fields.password)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1 tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-text-secondary">
          Join Pillar and start the conversation
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 px-4 py-3 rounded-lg bg-error/8 border border-error/20 text-sm text-error"
        >
          {serverError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          placeholder="your_username"
          value={fields.username}
          onChange={handleChange}
          error={errors.username}
          hint="Max 30 characters"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={fields.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          {/* Password strength indicator */}
          {fields.password && !errors.password && (
            <PasswordStrengthBar strength={passwordStrength} />
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
          className="mt-1"
        >
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-text-secondary leading-relaxed">
        By signing up you agree to our{' '}
        <span className="text-text-primary">Terms of Service</span>.
      </p>

      {/* Footer */}
      <p className="mt-5 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

// ─── Password strength ──────────────────────────────────────

function getPasswordStrength(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const strengthConfig = [
  { label: 'Weak',      color: 'bg-error' },
  { label: 'Fair',      color: 'bg-orange-400' },
  { label: 'Good',      color: 'bg-yellow-400' },
  { label: 'Strong',    color: 'bg-success' },
  { label: 'Very strong', color: 'bg-success' },
]

function PasswordStrengthBar({ strength }) {
  const config = strengthConfig[strength - 1] || strengthConfig[0]
  const segments = 4

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i < strength ? config.color : 'bg-border'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-text-secondary w-16 text-right">
        {config.label}
      </span>
    </div>
  )
}
