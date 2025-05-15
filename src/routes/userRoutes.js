import express from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from '../controllers/userController.js'
import {
  authenticateToken,
  authorizeAdmin,
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authenticateToken, getUsers)
router.get('/:id', authenticateToken, getUserById)
router.post('/', createUser)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser)

export default router
