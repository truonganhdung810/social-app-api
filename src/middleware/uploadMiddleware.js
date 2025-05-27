// middleware/uploadMiddleware.js
import multer, { diskStorage } from 'multer'
import path from 'path'

// Cấu hình nơi lưu trữ file upload
const storage = diskStorage({
  destination: (req, file, cb) => {
    console.log('Cấu hình storage', file)
    // Chỉ định thư mục lưu trữ file
    cb(null, './src/uploads/images')
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + file.originalname // Tạo tên file duy nhất
    cb(null, filename)
  },
})

// Middleware để upload một file duy nhất
const upload = multer({ storage: storage })

export default upload
