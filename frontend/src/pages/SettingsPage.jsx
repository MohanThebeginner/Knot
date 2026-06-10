import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Divider } from '@/components/ui/Divider'
import { Modal } from '@/components/ui/Modal'

export default function SettingsPage() {
  const { user, logout }          = useAuth()
  const { theme, setTheme, isDark } = useTheme()
  const toast                     = useToast()
  const navigate                  = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  function handleLogout() {
    logout()
    toast.success('Logged out successfully.')
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Account section */}
        <Section title="Account">
          <div className="flex items-center gap-4 py-1">
            <Avatar username={user.username} size="xl" />
            <div>
              <p className="text-base font-semibold text-text-primary">{user.username}</p>
              <p className="text-sm text-text-secondary mt-0.5">Member</p>
            </div>
          </div>

          <Divider className="my-2" />

          <SettingRow
            label="Username"
            description="Your unique identifier on Knots"
            value={user.username}
          />
        </Section>

        {/* Appearance section */}
        <Section title="Appearance">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-text-primary">Theme</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Choose how Knots looks to you
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-lg border border-border">
              <ThemeButton
                active={theme === 'light'}
                onClick={() => setTheme('light')}
                label="Light"
                icon={<SunIcon />}
              />
              <ThemeButton
                active={theme === 'dark'}
                onClick={() => setTheme('dark')}
                label="Dark"
                icon={<MoonIcon />}
              />
            </div>
          </div>
        </Section>

        {/* Danger zone */}
        <Section title="Session">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-text-primary">Log out</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Sign out of your account on this device
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogoutModal(true)}
            >
              Log out
            </Button>
          </div>
        </Section>

      </div>

      {/* Logout confirmation modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log out"
      >
        <p className="text-sm text-text-secondary mb-6">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="card p-5"
    >
      <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </motion.div>
  )
}

function SettingRow({ label, description, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        )}
      </div>
      {value && (
        <span className="text-sm text-text-secondary font-mono bg-surface-2 px-2.5 py-1 rounded border border-border">
          {value}
        </span>
      )}
    </div>
  )
}

function ThemeButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
        active
          ? 'bg-bg text-text-primary shadow-sm border border-border'
          : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M6.5 1v1.25M6.5 10.75V12M1 6.5h1.25M10.75 6.5H12M2.64 2.64l.88.88M9.48 9.48l.88.88M2.64 10.36l.88-.88M9.48 3.52l.88-.88"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M11 7.5A5 5 0 016 2.5a5 5 0 100 9 5 5 0 005-4z"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
