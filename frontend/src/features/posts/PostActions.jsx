import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePost } from '@/hooks/usePost'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export function PostActions({ post, onDeleted }) {
  const { deletePost, loading } = usePost()
  const toast                   = useToast()
  const navigate                = useNavigate()
  const [showModal, setShowModal] = useState(false)

  async function handleDelete() {
    try {
      await deletePost(post._id)
      toast.success('Post deleted.')
      setShowModal(false)
      onDeleted ? onDeleted(post._id) : navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Failed to delete post.')
      setShowModal(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => navigate(`/posts/${post._id}/edit`)}
        >
          <EditIcon />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setShowModal(true)}
          className="text-error hover:bg-error/8 hover:text-error"
        >
          <TrashIcon />
          Delete
        </Button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Delete post"
      >
        <p className="text-sm text-text-secondary mb-1 break-words">
          Are you sure you want to delete{' '}
          <span className="font-medium text-text-primary">"{post.title}"</span>?
        </p>
        <p className="text-xs text-text-secondary mb-6">
          This action cannot be undone. All comments will also be deleted.
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowModal(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={loading}
            className="w-full sm:w-auto"
          >
            Delete post
          </Button>
        </div>
      </Modal>
    </>
  )
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M9.5 1.5l2 2L4 11H2v-2L9.5 1.5z"
        stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10.5 3.5l-.5 7a1 1 0 01-1 1h-5a1 1 0 01-1-1l-.5-7"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
