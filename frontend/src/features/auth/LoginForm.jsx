import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginForm() {
  const { login } = useAuth()
  const toast     = useToast()
  const navigate  = useNavigate()
  const location  = useLocation()

  const from = location.state?.from?.pathname || '/'

  const [fields, setFields]   = useState({ username: '', password: '' })
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
    if (!fields.username.trim()) errs.username = 'Username is required'
    if (!fields.password)        errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      await login({ username: fields.username.trim(), password: fields.password })
      toast.success(`Welcome back, ${fields.username}!`)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary">
          Sign in to continue to Pillar
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
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={fields.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
          className="mt-1"
        >
          Sign in
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-accent font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
