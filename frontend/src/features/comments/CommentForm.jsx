import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export function CommentForm({ onSubmit, submitting }) {
  const { isAuthenticated, user } = useAuth()
  const [body, setBody]           = useState('')
  const [error, setError]         = useState('')
  const [focused, setFocused]     = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="px-5 py-4 border-t border-border text-sm text-text-secondary">
        <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
        {' '}to join the discussion.
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!body.trim()) { setError('Comment cannot be empty.'); return }
    setError('')
    await onSubmit({ body: body.trim() })
    setBody('')
    setFocused(false)
  }

  function handleKeyDown(e) {
    // Cmd/Ctrl + Enter submits
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-border">
      <div className="flex gap-3">
        <Avatar username={user.username} size="sm" className="mt-0.5 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div
            className={cn(
              'rounded-lg border bg-bg transition-shadow duration-150',
              focused
                ? 'border-accent shadow-[0_0_0_3px_rgba(79,124,255,0.12)]'
                : 'border-border',
              error && 'border-error'
            )}
          >
            <textarea
              value={body}
              onChange={e => { setBody(e.target.value); if (error) setError('') }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment…"
              rows={focused || body ? 3 : 1}
              className="w-full px-3 pt-2.5 pb-1 text-sm bg-transparent text-text-primary placeholder:text-text-secondary/70 resize-none outline-none transition-all duration-150"
            />
            {(focused || body) && (
              <div className="flex items-center justify-between px-3 pb-2.5 gap-2">
                <span className="text-xs text-text-secondary">
                  ⌘↵ to submit
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => { setBody(''); setFocused(false); setError('') }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="xs"
                    loading={submitting}
                    disabled={submitting || !body.trim()}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      </div>
    </form>
  )
}
