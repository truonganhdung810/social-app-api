import { PostModel } from '../models/post.js'
import { UserModel } from '../models/user.js'
import jwt from 'jsonwebtoken'

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server-Error' })
  }
}

export const getUserById = async (req, res) => {
  try {
    // Lấy ID từ token (được middleware authenticateToken gán vào req.user)
    const tokenUserId = req.user.id

    // Lấy ID từ URL
    const paramUserId = req.params.id

    // Tìm user trong database
    const user = await UserModel.findById(paramUserId)

    if (!user) return res.status(404).json({ message: 'User not found' })

    if (tokenUserId == paramUserId) {
      return res.json({
        ...user,
        isMe: 1, // Đánh dấu đây là user trong token
      })
    } else {
      return res.json({
        ...user,
        isMe: 0, // Đây là user khác
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createUser = async (req, res) => {
  try {
    const id = await UserModel.create(req.body)

    // Khi đăng ký, tạo 1 token và gửi về cho client
    const user = await UserModel.findById(id)
    const token = jwt.sign({ id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    console.log('>> Token', token)

    res.status(201).json({ message: 'User created', token, id })
  } catch (err) {
    if (err.message === 'Email already in use') {
      return res.status(400).json({ message: 'Email already exists' })
    }
    console.error(err)
    res.status(500).json({ message: 'Server error', token })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const affectedRows = await UserModel.delete(req.params.id)
    if (!affectedRows)
      return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUsersWithPublicPosts = async (req, res) => {
  try {
    console.log('REQ PATH:', req.path)
    // Lấy tất cả user role = 'user'
    const users = await UserModel.getAllUsers()
    const posts = await PostModel.getAllPublicPosts()

    // Gắn bài viết vào từng user
    const usersWithPosts = users.map((user) => {
      const userPosts = posts.filter((post) => post.user_id === user.id)
      return {
        ...user,
        posts: userPosts,
      }
    })

    res.json(usersWithPosts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers() // hàm này bạn đã có
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getPublicUserProfile = async (req, res) => {
  const userId = req.params.id

  try {
    const user = await UserModel.getPublicUserById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found or is admin' })
    }

    return res.json({ user })
  } catch (err) {
    console.error('Error getting user:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
