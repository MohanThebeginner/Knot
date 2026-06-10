import api from './api'

export const commentService = {
  /**
   * GET /posts/:postId/comments
   * @returns {Comment[]}
   */
  async getComments(postId) {
    const res = await api.get(`/posts/${postId}/comments`)
    return res.data
  },

  /**
   * POST /posts/:postId/comments
   * @returns {Comment}
   */
  async createComment(postId, { body }) {
    const res = await api.post(`/posts/${postId}/comments`, { body })
    return res.data
  },

  /**
   * DELETE /posts/:postId/comments/:commentId
   * @returns {{ message: string }}
   */
  async deleteComment(postId, commentId) {
    const res = await api.delete(`/posts/${postId}/comments/${commentId}`)
    return res.data
  },
}
