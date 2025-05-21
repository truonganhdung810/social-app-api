import { UserModel } from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await UserModel.findByEmail(email)
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        cover_photo: user.cover_photo,
        role: user.role,
        cover_offsetX: user.cover_offsetX,
        cover_offsetY: user.cover_offsetY,
        ava_offsetX: user.ava_offsetX,
        ava_offsetY: user.ava_offsetY,
        ava_width: user.ava_width,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
