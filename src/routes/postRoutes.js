import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Route mẫu tạo post (sẽ thêm sau)
router.post('/', authenticateToken, (req, res) => {
  res.json({ message: 'Post created' })
})

export default router
