import { db } from '../config/db.js'
import bcrypt from 'bcryptjs'

export const UserModel = {
  // Lấy danh sách user thường
  async getAllUsers() {
    const [users] = await db.execute(
      "SELECT id, name, avatar, cover_photo, cover_offsetX, cover_offsetY, ava_offsetX, ava_offsetY, ava_width FROM users WHERE role = 'user'"
    )
    return users
  },

  async findAll() {
    const [rows] = await db.query(
      'SELECT id, name, email, avatar, cover_photo, ava_offsetX, ava_offsetY, ava_width role FROM users'
    )
    return rows
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, avatar, cover_photo, role, cover_offsetX, cover_offsetY, ava_offsetX, ava_offsetY, ava_width FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [
      email,
    ])
    return rows[0]
  },

  async create(user) {
    const { name, email, password, avatar, cover_photo, role } = user
    const existingUser = await this.findByEmail(email)
    if (existingUser) {
      throw new Error('Email already in use')
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, avatar, cover_photo, role) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name,
        email,
        hashedPassword,
        avatar || null,
        cover_photo || null,
        role || 'user',
      ]
    )
    return result.insertId
  },

  async updateCover(cover) {
    const { id, cover_photo, offsetx, offsety } = cover
    const query =
      'UPDATE users SET cover_photo = ?, cover_offsetX = ?, cover_offsetY = ? WHERE id = ?;'
    const update = await db.query(
      query,
      [cover_photo, offsetx, offsety, id],
      (err, result) => {
        if (err) {
          console.error('Lỗi khi cập nhật dữ liệu:', err)
          return res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu!' })
        }

        return res.status(200).json({ message: 'Cập nhật thành công!' })
      }
    )
    return update
  },

  async updateAvatar(avatar) {
    const { id, avatar_src, offsetx, offsety, ava_width } = avatar
    console.log('avatar width', ava_width)
    const query =
      'UPDATE users SET avatar = ?, ava_offsetX = ?, ava_offsetY = ?, ava_width = ? WHERE id = ?;'
    const update = await db.query(
      query,
      [avatar_src, offsetx, offsety, ava_width, id],
      (err, result) => {
        if (err) {
          console.error('Lỗi khi cập nhật dữ liệu:', err)
          return res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu!' })
        }

        return res.status(200).json({ message: 'Cập nhật thành công!' })
      }
    )
    return update
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id])
    return result.affectedRows
  },

  async getPublicUserById(userId) {
    const [rows] = await db.execute(
      `
    SELECT 
       id, name, avatar, cover_photo,
      cover_offsetX, cover_offsetY,
      ava_offsetX, ava_offsetY, ava_width
    FROM users 
    WHERE id = ? AND role != 'admin'
    `,
      [userId]
    )

    return rows[0] || null
  },
}
