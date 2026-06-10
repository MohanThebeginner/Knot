import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PostCard } from './PostCard'
import { PageSpinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export function PostFeed({
  posts,
  loading,
  error,
  search,
  currentPage,
  totalPage,
  totalPost,
  onSearch,
  onPageChange,
  onPostDeleted,
}) {
  const searchRef = useRef(null)

  function handleSearchChange(e) {
    onSearch(e.target.value)
  }

  function clearSearch() {
    onSearch('')
    searchRef.current?.focus()
  }

  return (
    <div>
      {/* Feed header */}
      <div className="sticky top-0 z-10 bg-bg/90 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center justify-between gap-3">
        <h1 className="text-sm font-semibold text-text-primary hidden sm:block">
          {search
            ? `Results for "${search}"`
            : 'Home'
          }
        </h1>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs ml-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search posts…"
            className="input-base pl-8 pr-8 h-8 text-sm"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-16">
          <PageSpinner />
        </div>
      )}

      {/* Posts list */}
      {!loading && !error && (
        <>
          <AnimatePresence mode="wait">
            {posts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  icon={<PostsIcon />}
                  title={search ? 'No posts found' : 'Nothing here yet'}
                  description={
                    search
                      ? `No posts match "${search}". Try a different term.`
                      : 'Be the first to post something.'
                  }
                  action={
                    search ? (
                      <Button variant="outline" size="sm" onClick={clearSearch}>
                        Clear search
                      </Button>
                    ) : null
                  }
                />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {posts.map((post, index) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    index={index}
                    onDeleted={onPostDeleted}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPage > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPage={totalPage}
              totalPost={totalPost}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

// ─── Pagination ─────────────────────────────────────────────

function Pagination({ currentPage, totalPage, totalPost, onPageChange }) {
  const pages = buildPageRange(currentPage, totalPage)

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-border">
      <p className="text-xs text-text-secondary">
        Page {currentPage} of {totalPage}
        <span className="hidden sm:inline"> · {totalPost} posts</span>
      </p>

      <div className="flex items-center gap-1">
        <PageButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </PageButton>

        {pages.map((page, i) =>
          page === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-text-secondary select-none">
              …
            </span>
          ) : (
            <PageButton
              key={page}
              onClick={() => onPageChange(page)}
              active={page === currentPage}
            >
              {page}
            </PageButton>
          )
        )}

        <PageButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPage}
          aria-label="Next page"
        >
          <ChevronRight />
        </PageButton>
      </div>
    </div>
  )
}

function PageButton({ children, onClick, disabled, active, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'min-w-[28px] h-7 px-1.5 rounded text-xs font-medium transition-colors',
        active
          ? 'bg-accent text-white'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-2',
        disabled && 'opacity-30 cursor-not-allowed pointer-events-none'
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Build a smart page range: [1, …, 4, 5, 6, …, 10]
function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const range = []
  const delta = 1

  const left  = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  range.push(1)
  if (left > 2) range.push('…')
  for (let i = left; i <= right; i++) range.push(i)
  if (right < total - 1) range.push('…')
  range.push(total)

  return range
}

// ─── Icons ───────────────────────────────────────────────────

function SearchIcon({ className }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M3.5 3.5l6 6M9.5 3.5l-6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8.5 3.5L5 7l3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 3.5L9 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PostsIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="6" y="8" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 15h16M12 20h16M12 25h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
