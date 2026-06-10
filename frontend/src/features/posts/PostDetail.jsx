import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Avatar } from '@/components/ui/Avatar'
import { PostImage } from './PostImage'
import { PostActions } from './PostActions'
import { formatDateTime } from '@/utils/formatDate'
import { cn } from '@/utils/cn'
import { postService } from '@/services/postService'

export function PostDetail({ post }) {
  const { isOwner, isAuthenticated } = useAuth()
  const { error: toastError } = useToast()
  const [likeState, setLikeState] = useState({
    likeCount: post.likeCount || 0,
    isLiked: post.isLiked || false,
    loading: false
  })
  const owned = isOwner(post.author?._id)

  async function handleToggleLike() {
    if (!isAuthenticated) {
      toastError('Please log in to like posts')
      return
    }

    setLikeState(prev => ({ ...prev, loading: true }))
    try {
      const result = await postService.toggleLike(post._id)
      setLikeState({
        likeCount: result.likes,
        isLiked: result.liked,
        loading: false
      })
    } catch (err) {
      setLikeState(prev => ({ ...prev, loading: false }))
      toastError(err.message || 'Failed to toggle like')
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="px-5 py-6"
    >
      {/* Title */}
      <h1 className="text-2xl font-bold text-text-primary leading-tight tracking-tight mb-4 text-balance">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <Avatar username={post.author?.username} size="md" />
          <div>
            <p className="text-sm font-medium text-text-primary leading-none mb-0.5">
              {post.author?.username}
            </p>
            <time
              className="text-xs text-text-secondary"
              dateTime={post.createdAt}
            >
              {formatDateTime(post.createdAt)}
            </time>
          </div>
        </div>

        {owned && <PostActions post={post} />}
      </div>

      {/* Image */}
      {post.image?.url && (
        <PostImage
          url={post.image.url}
          alt={post.title}
          className="mb-5 max-h-[480px]"
        />
      )}

      {/* Body */}
      <div className="prose-content">
        {post.content}
      </div>

      {/* Updated indicator */}
      {post.updatedAt !== post.createdAt && (
        <p className="mt-6 text-xs text-text-secondary">
          Edited {formatDateTime(post.updatedAt)}
        </p>
      )}

      {/* Like button */}
      <div className="mt-6 pt-4 border-t border-border">
        <button
          onClick={handleToggleLike}
          disabled={likeState.loading}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors',
            likeState.isLiked 
              ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10' 
              : 'text-text-secondary hover:text-red-500 hover:bg-red-500/10',
            likeState.loading && 'opacity-60 cursor-not-allowed'
          )}
          aria-label={likeState.isLiked ? 'Unlike post' : 'Like post'}
        >
          <HeartIcon filled={likeState.isLiked} />
          <span>{likeState.likeCount} {likeState.likeCount === 1 ? 'Like' : 'Likes'}</span>
        </button>
      </div>
    </motion.article>
  )
}

function HeartIcon({ filled = false }) {
  return (
    <svg width="18" height="18" viewBox="0 0 17 17" fill="none">
      {filled ? (
        <path
          d="M14.5 5.5c0-1.933-1.567-3.5-3.5-3.5-1.382 0-2.58.8-3 1.963C7.58 2.8 6.382 2 5 2 3.067 2 1.5 3.567 1.5 5.5c0 5.5 6.5 8.5 6.5 8.5s6.5-3 6.5-8.5z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M14 5c0-1.933-1.567-3.5-3.5-3.5-1.382 0-2.58.8-3 1.963C7.08 1.8 5.882 1 4.5 1 2.567 1 1 2.567 1 4.5 1 10 7.5 13 7.5 13s6.5-3 6.5-8.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      )}
    </svg>
  )
}
