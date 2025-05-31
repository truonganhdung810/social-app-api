import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import path from 'path'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend domain
    credentials: true, // Cho phép gửi + nhận cookie
  })
)
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.use('/api/upload/', uploadRoutes)

// Các Routes của Posts
app.use('/api/posts/', postRoutes)

// Public folder 'uploads' ở đường dẫn /uploads
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Route mẫu
app.get('/', (req, res) => {
  res.json({ message: 'API is running' })
})

export default app
