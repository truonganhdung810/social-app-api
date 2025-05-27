import express from 'express'
import { authenticateUpload } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'
import { uploadAvatar, uploadCover } from '../controllers/uploadController.js'

const router = express.Router()

router.post(
  '/cover',
  authenticateUpload,
  upload.single('cover-image'),
  uploadCover
)

router.post(
  '/avatar',
  authenticateUpload,
  upload.single('avatar-image'),
  uploadAvatar
)

export default router
