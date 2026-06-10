import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePost } from '@/hooks/usePost'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { postService } from '@/services/postService'
import { PostForm } from '@/features/posts/PostForm'
import { PageSpinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

export default function EditPostPage() {
  const { id }                  = useParams()
  const { editPost, loading }   = usePost()
  const { isOwner }             = useAuth()
  const toast                   = useToast()
  const navigate                = useNavigate()

  const [post,        setPost]        = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError,   setFetchError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await postService.getAllPosts({ limit: 100 })
        if (cancelled) return
        const found = data.posts.find(p => p._id === id)
        if (!found) {
          setFetchError('Post not found.')
        } else if (!isOwner(found.author?._id)) {
          setFetchError('You are not authorized to edit this post.')
        } else {
          setPost(found)
        }
      } catch (err) {
        if (!cancelled) setFetchError(err.message || 'Failed to load post.')
      } finally {
        if (!cancelled) setFetchLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, isOwner])

  async function handleSubmit(payload) {
    try {
      await editPost(id, payload)
      toast.success('Post updated.')
      navigate(`/posts/${id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update post.')
    }
  }

  if (fetchLoading) return <PageSpinner />

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <p className="text-sm text-error">{fetchError}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Back to home
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        <div className="mb-6">
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            Edit post
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Make changes to your post
          </p>
        </div>

        <div className="card p-6">
          <PostForm
            initialValues={{ title: post.title, content: post.content }}
            existingImage={post.image?.url || null}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Save changes"
            onCancel={() => navigate(`/posts/${id}`)}
          />
        </div>
      </motion.div>
    </div>
  )
}
