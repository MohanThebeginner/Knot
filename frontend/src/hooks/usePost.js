import { useCallback, useState } from 'react'
import { postService } from '@/services/postService'

/**
 * Handles create, edit, delete for a single post.
 * State is minimal — pages handle navigation after actions.
 */
export function usePost() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const createPost = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const post = await postService.createPost(payload)
      return post
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const editPost = useCallback(async (id, payload) => {
    setLoading(true)
    setError(null)
    try {
      const post = await postService.editPost(id, payload)
      return post
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePost = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await postService.deletePost(id)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, createPost, editPost, deletePost }
}
