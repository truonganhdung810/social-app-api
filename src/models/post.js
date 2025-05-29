import { db } from '../config/db.js'
import bcrypt from 'bcryptjs'

export const PostModel = {
  // Tạo bài viết mới
  async create(newPost) {
    const { userId, content, imageUrl, visibility } = newPost
    console.log('du lieu new post', userId, content, imageUrl, visibility)
    const [result] = await db.execute(
      'INSERT INTO posts (user_id, content, image, visibility) VALUES (?, ?, ?, ?)',
      [userId, content, imageUrl, visibility]
    )

    const insertId = result.insertId
    const [rows] = await db.execute('SELECT * FROM posts WHERE id = ?', [
      insertId,
    ])
    return { affectedRows: result.affectedRows, ...rows[0] }
  },

  // Sửa bài viết
  async update(editPost) {
    const { postId, userId, content, visibility = 'public' } = editPost
    const [result] = await db.execute(
      'UPDATE posts SET content = ?, visibility = ? WHERE id = ? AND user_id = ?',
      [content, visibility, postId, userId]
    )
    return result.affectedRows > 0
  },

  // Xoá bài viết
  async delete(postId, userId) {
    console.log('User', userId, 'Post', postId)
    const [result] = await db.execute(
      'DELETE FROM posts WHERE id = ? AND user_id = ?',
      [postId, userId]
    )
    return result.affectedRows > 0
  },

  async deleteAsAdmin(postId) {
    const [result] = await db.execute('DELETE FROM posts WHERE id = ?', [
      postId,
    ])
    return result.affectedRows > 0
  },

  // (tuỳ chọn) Lấy bài viết
  async getById(postId) {
    console.log('Query: ', 'SELECT * FROM posts WHERE id = ', postId)
    const [rows] = await db.execute('SELECT * FROM posts WHERE id = ?', [
      postId,
    ])
    return rows[0]
  },

  async getPostsByUserId(userId) {
    const sql = `
      SELECT posts.id, posts.content, posts.image, posts.visibility, posts.created_at,
             users.name, users.avatar, users.ava_offsetX, users.ava_offsetY, users.ava_width
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = ?
      ORDER BY posts.created_at DESC
    `

    try {
      const [rows] = await db.execute(sql, [userId])
      return rows
    } catch (error) {
      console.error('Error fetching posts by userId:', error)
      throw error
    }
  },
}
