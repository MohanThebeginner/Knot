import { useCallback, useEffect, useState } from 'react'
import { commentService } from '@/services/commentService'

/**
 * Manages comments for a single post.
 * Optimistic updates on create and delete for snappy UX.
 */
export function useComments(postId) {
  const [comments, setComments] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    if (!postId) return
    setLoading(true)
    setError(null)
    try {
      const data = await commentService.getComments(postId)
      setComments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const createComment = useCallback(async ({ body }, currentUser) => {
    setSubmitting(true)
    try {
      const newComment = await commentService.createComment(postId, { body })

      // The backend returns the comment without populated author on create,
      // so we augment it with the current user's info for immediate display.
      const augmented = {
        ...newComment,
        author: { _id: currentUser._id, username: currentUser.username },
      }
      setComments(prev => [augmented, ...prev])
      return augmented
    } catch (err) {
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [postId])

  const deleteComment = useCallback(async (commentId) => {
    // Optimistic removal
    setComments(prev => prev.filter(c => c._id !== commentId))
    try {
      await commentService.deleteComment(postId, commentId)
    } catch (err) {
      // Revert on failure
      fetchComments()
      throw err
    }
  }, [postId, fetchComments])

  return {
    comments,
    loading,
    error,
    submitting,
    createComment,
    deleteComment,
    refetch: fetchComments,
  }
}
