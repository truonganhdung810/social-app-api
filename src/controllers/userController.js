import { UserModel } from '../models/user.js'

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createUser = async (req, res) => {
  try {
    const id = await UserModel.create(req.body)
    res.status(201).json({ message: 'User created', id })
  } catch (err) {
    if (err.message === 'Email already in use') {
      return res.status(400).json({ message: 'Email already exists' })
    }
    console.error(err)
    res.status(500).json({ message: 'Server error' })
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
