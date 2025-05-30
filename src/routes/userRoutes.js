import express from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  getAllUsers,
  getPublicUserProfile,
} from '../controllers/userController.js'
import {
  authenticateToken,
  authorizeAdmin,
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/public', getAllUsers)
router.get('/public/:id', getPublicUserProfile)
router.get('/', authenticateToken, getUsers)
router.get('/:id', authenticateToken, getUserById)
router.post('/', createUser)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser)

export default router
