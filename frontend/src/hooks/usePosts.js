import { useCallback, useEffect, useRef, useState } from 'react'
import { postService } from '@/services/postService'

const DEFAULT_LIMIT = 5

/**
 * Manages a paginated, searchable post feed.
 * All network calls are handled here — pages just read state.
 */
export function usePosts({ initialSearch = '' } = {}) {
  const [posts,       setPosts]       = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage,   setTotalPage]   = useState(1)
  const [totalPost,   setTotalPost]   = useState(0)
  const [search,      setSearch]      = useState(initialSearch)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)

  // Debounce search input
  const searchTimeout = useRef(null)

  const fetchPosts = useCallback(async (page, searchTerm) => {
    setLoading(true)
    setError(null)
    try {
      const data = await postService.getAllPosts({
        page,
        limit: DEFAULT_LIMIT,
        search: searchTerm,
      })
      setPosts(data.posts)
      setCurrentPage(data.currentPage)
      setTotalPage(data.totalPage)
      setTotalPost(data.totalPost)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount and when page changes
  useEffect(() => {
    fetchPosts(currentPage, search)
  }, [currentPage, fetchPosts]) // intentionally not including search here — handled by debounce

  // Debounced search: reset to page 1 on new search term
  function handleSearch(term) {
    setSearch(term)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setCurrentPage(1)
      fetchPosts(1, term)
    }, 350)
  }

  function goToPage(page) {
    if (page < 1 || page > totalPage) return
    setCurrentPage(page)
  }

  function refresh() {
    fetchPosts(currentPage, search)
  }

  /**
   * Optimistically remove a post from the feed after deletion.
   */
  function removePost(id) {
    setPosts(prev => prev.filter(p => p._id !== id))
    setTotalPost(prev => prev - 1)
  }

  return {
    posts,
    loading,
    error,
    search,
    currentPage,
    totalPage,
    totalPost,
    handleSearch,
    goToPage,
    refresh,
    removePost,
  }
}
