import { db } from '../config/db.js'
import bcrypt from 'bcryptjs'

export const UserModel = {
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

  async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id])
    return result.affectedRows
  },
}
