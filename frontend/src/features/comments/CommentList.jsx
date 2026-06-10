import { AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/useToast'
import { useComments } from '@/hooks/useComments'
import { useAuth } from '@/hooks/useAuth'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Divider } from '@/components/ui/Divider'

export function CommentList({ postId }) {
  const { user }  = useAuth()
  const toast     = useToast()
  const {
    comments,
    loading,
    error,
    submitting,
    createComment,
    deleteComment,
  } = useComments(postId)

  async function handleSubmit(payload) {
    try {
      await createComment(payload, user)
      toast.success('Comment posted.')
    } catch (err) {
      toast.error(err.message || 'Failed to post comment.')
    }
  }

  async function handleDelete(commentId) {
    try {
      await deleteComment(commentId)
      toast.success('Comment deleted.')
    } catch (err) {
      toast.error(err.message || 'Failed to delete comment.')
      throw err
    }
  }

  return (
    <section aria-label="Comments">
      <Divider />

      {/* Section header */}
      <div className="px-5 py-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">
          {loading ? 'Comments' : `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`}
        </h2>
      </div>

      {/* Comment form */}
      <CommentForm onSubmit={handleSubmit} submitting={submitting} />

      {/* States */}
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner size="md" className="text-accent" />
        </div>
      )}

      {error && !loading && (
        <div className="px-5 py-6 text-center">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <EmptyState
          icon={<BubbleIcon />}
          title="No comments yet"
          description="Start the conversation."
          className="py-10"
        />
      )}

      {!loading && !error && comments.length > 0 && (
        <div>
          <AnimatePresence initial={false}>
            {comments.map((comment, index) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                index={index}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

function BubbleIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M30 17a12 12 0 01-12 12 11.9 11.9 0 01-6-1.6L5 30l2.6-7A11.9 11.9 0 015 17 12 12 0 0118 5a12 12 0 0112 12z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}
