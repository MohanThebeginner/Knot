import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePosts } from '@/hooks/usePosts'
import { PostFeed } from '@/features/posts/PostFeed'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const {
    posts,
    loading,
    error,
    search,
    currentPage,
    totalPage,
    totalPost,
    handleSearch,
    goToPage,
    removePost,
  } = usePosts()

  return (
    <div>
      {/* Guest CTA strip */}
      {!isAuthenticated && !loading && (
        <div className="px-5 py-3 border-b border-border bg-surface flex items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            Join the discussion — create an account to post and comment.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      )}

      <PostFeed
        posts={posts}
        loading={loading}
        error={error}
        search={search}
        currentPage={currentPage}
        totalPage={totalPage}
        totalPost={totalPost}
        onSearch={handleSearch}
        onPageChange={goToPage}
        onPostDeleted={removePost}
      />
    </div>
  )
}
