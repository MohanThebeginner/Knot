import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { postService } from '@/services/postService'
import { PostDetail } from '@/features/posts/PostDetail'
import { CommentList } from '@/features/comments/CommentList'
import { PageSpinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

export default function PostPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [post,     setPost]    = useState(null)
  const [loading,  setLoading] = useState(true)
  const [error,    setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Fetch the full feed and find this post by ID.
        // The backend has no GET /posts/:id endpoint — we work with what exists.
        const data = await postService.getAllPosts({ limit: 100 })
        if (cancelled) return
        const found = data.posts.find(p => p._id === id)
        if (!found) {
          setError('Post not found.')
        } else {
          setPost(found)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load post.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <PageSpinner />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <p className="text-sm text-error">{error}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Back to home
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Back navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-5 py-3 border-b border-border"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <BackIcon />
          Back
        </Link>
      </motion.div>

      {/* Post body */}
      <PostDetail post={post} />

      {/* Divider + comments */}
      <CommentList postId={id} />
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
