import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'
import { timeAgo } from '@/utils/formatDate'
import { cn } from '@/utils/cn'

export function CommentItem({ comment, onDelete, index = 0 }) {
  const { isOwner }     = useAuth()
  const owned           = isOwner(comment.author?._id)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(comment._id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className="group flex gap-3 px-5 py-4 border-b border-border last:border-0"
    >
      <Avatar username={comment.author?.username} size="sm" className="mt-0.5 shrink-0" />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-text-primary">
              {comment.author?.username}
            </span>
            <span className="text-text-secondary text-xs">·</span>
            <time
              className="text-xs text-text-secondary"
              dateTime={comment.createdAt}
              title={new Date(comment.createdAt).toLocaleString()}
            >
              {timeAgo(comment.createdAt)}
            </time>
          </div>

          {owned && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                'text-xs text-text-secondary hover:text-error transition-colors px-1.5 py-0.5 rounded',
                deleting && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Delete comment"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>

        {/* Body */}
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
          {comment.body}
        </p>
      </div>
    </motion.div>
  )
}
