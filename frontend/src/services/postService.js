import api from './api'

export const postService = {
  /**
   * GET /posts
   * @param {{ page?: number, limit?: number, search?: string }} params
   * @returns {{ posts, currentPage, totalPage, totalPost }}
   */
  async getAllPosts({ page = 1, limit = 5, search = '' } = {}) {
    const params = { page, limit }
    if (search) params.search = search
    const res = await api.get('/posts', { params })
    return res.data
  },

  /**
   * POST /posts
   * Sends multipart/form-data (title, content, image?)
   * @returns {Post}
   */
  async createPost({ title, content, image }) {
    const form = new FormData()
    form.append('title', title)
    form.append('content', content)
    if (image) form.append('image', image)

    const res = await api.post('/posts', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * PUT /posts/:id
   * Sends multipart/form-data (title?, content?, image?)
   * @returns {Post}
   */
  async editPost(id, { title, content, image }) {
    const form = new FormData()
    if (title   !== undefined) form.append('title',   title)
    if (content !== undefined) form.append('content', content)
    if (image)                 form.append('image',   image)

    const res = await api.put(`/posts/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * DELETE /posts/:id
   * @returns {{ message: string }}
   */
  async deletePost(id) {
    const res = await api.delete(`/posts/${id}`)
    return res.data
  },

  /**
   * POST /posts/:id/like
   * Toggle like on a post
   * @returns {{ likes: number, liked: boolean, message: string }}
   */
  async toggleLike(id) {
    const res = await api.post(`/posts/${id}/like`)
    return res.data
  },
}
