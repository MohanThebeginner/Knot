import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Avatar } from '@/components/ui/Avatar'
import { PostImage } from './PostImage'
import { PostActions } from './PostActions'
import { timeAgo } from '@/utils/formatDate'
import { cn } from '@/utils/cn'
import { postService } from '@/services/postService'

export function PostCard({ post, onDeleted, index = 0 }) {
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.04, ease: 'easeOut' }}
      className="group border-b border-border px-5 py-5 hover:bg-surface/60 transition-colors duration-150"
    >
      {/* Author row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar username={post.author?.username} size="sm" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-text-primary">
              {post.author?.username}
            </span>
            <span className="text-text-secondary text-xs">·</span>
            <time
              className="text-xs text-text-secondary"
              dateTime={post.createdAt}
              title={new Date(post.createdAt).toLocaleString()}
            >
              {timeAgo(post.createdAt)}
            </time>
          </div>
        </div>

        {owned && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <PostActions post={post} onDeleted={onDeleted} />
          </div>
        )}
      </div>

      {/* Content */}
      <Link to={`/posts/${post._id}`} className="block group/link">
        <h2 className={cn(
          'text-base font-semibold text-text-primary leading-snug mb-2',
          'group-hover/link:text-accent transition-colors duration-150'
        )}>
          {post.title}
        </h2>

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {post.content}
        </p>

        {post.image?.url && (
          <PostImage
            url={post.image.url}
            alt={post.title}
            className="mt-3 max-h-72"
          />
        )}
      </Link>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={handleToggleLike}
          disabled={likeState.loading}
          className={cn(
            'flex items-center gap-1.5 text-xs transition-colors',
            likeState.isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-text-secondary hover:text-red-500',
            likeState.loading && 'opacity-60 cursor-not-allowed'
          )}
          aria-label={likeState.isLiked ? 'Unlike post' : 'Like post'}
        >
          <HeartIcon filled={likeState.isLiked} />
          <span>{likeState.likeCount}</span>
        </button>

        <Link
          to={`/posts/${post._id}`}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
        >
          <CommentIcon />
          <span>Comment</span>
        </Link>
      </div>
    </motion.article>
  )
}

function HeartIcon({ filled = false }) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
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

function CommentIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path
        d="M1 3a2 2 0 012-2h11a2 2 0 012 2v7a2 2 0 01-2 2h-4l-3.5 2.5V12H3a2 2 0 01-2-2V3z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}


// function CommentIcon() {
//   return (
//     <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//       <path d="M11.5 6.5a5 5 0 01-5 5 4.98 4.98 0 01-2.5-.67L1.5 11.5l.67-2.5A4.98 4.98 0 011.5 6.5a5 5 0 015-5 5 5 0 015 5z"
//         stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
//     </svg>
//   )
// }
