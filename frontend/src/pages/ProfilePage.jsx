import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { usePosts } from '@/hooks/usePosts'
import { Avatar } from '@/components/ui/Avatar'
import { PostCard } from '@/features/posts/PostCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/formatDate'

export default function ProfilePage() {
  const { user }           = useAuth()
  const { posts, loading, error, removePost } = usePosts()

  // Filter posts by current user — no dedicated profile endpoint exists
  const myPosts = useMemo(
    () => posts.filter(p => p.author?._id === user._id || p.author?.username === user.username),
    [posts, user]
  )

  return (
    <div>
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="px-5 py-6 border-b border-border"
      >
        <div className="flex items-start gap-4">
          <Avatar username={user.username} size="xl" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              {user.username}
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">Member</p>
            <div className="flex items-center gap-4 mt-3">
              <Stat label="Posts" value={myPosts.length} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link to="/posts/new">
            <Button variant="primary" size="sm">
              <PlusIcon />
              New post
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="outline" size="sm">Settings</Button>
          </Link>
        </div>
      </motion.div>

      {/* Posts section */}
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-text-primary">
          Your posts
        </h2>
      </div>

      {loading && <PageSpinner />}

      {error && !loading && (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {!loading && !error && myPosts.length === 0 && (
        <EmptyState
          icon={<WriteIcon />}
          title="No posts yet"
          description="Share something with the community."
          action={
            <Link to="/posts/new">
              <Button variant="primary" size="sm">Write your first post</Button>
            </Link>
          }
        />
      )}

      {!loading && !error && myPosts.length > 0 && (
        <div>
          {myPosts.map((post, index) => (
            <PostCard
              key={post._id}
              post={post}
              index={index}
              onDeleted={removePost}
            />
          ))}
          {posts.length >= 5 && (
            <p className="px-5 py-4 text-xs text-text-secondary text-center border-t border-border">
              Showing posts from the current page.{' '}
              <Link to="/" className="text-accent hover:underline">Browse all</Link>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-sm font-semibold text-text-primary">{value}</span>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  )
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function WriteIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M28 8l4 4L14 30H10v-4L28 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6 34h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
