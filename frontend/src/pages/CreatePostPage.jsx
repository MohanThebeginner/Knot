import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePost } from '@/hooks/usePost'
import { useToast } from '@/hooks/useToast'
import { PostForm } from '@/features/posts/PostForm'

export default function CreatePostPage() {
  const { createPost, loading } = usePost()
  const toast                   = useToast()
  const navigate                = useNavigate()

  async function handleSubmit(payload) {
    try {
      const post = await createPost(payload)
      toast.success('Post published!')
      navigate(`/posts/${post._id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to publish post.')
    }
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
            New post
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Share something with the community
          </p>
        </div>

        <div className="card p-6">
          <PostForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Publish"
            onCancel={() => navigate(-1)}
          />
        </div>
      </motion.div>
    </div>
  )
}
