// middleware/uploadMiddleware.js
const multer = require('multer')
const path = require('path')

// Cấu hình nơi lưu trữ file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Cấu hình storage', file)
    // Chỉ định thư mục lưu trữ file
    cb(null, './uploads/images')
  },
  filename: (req, file, cb) => {
    // Đặt tên file với timestamp + phần mở rộng
    const ext = path.extname(file.originalname) // Lấy phần mở rộng của file
    const filename = Date.now() + ext // Tạo tên file duy nhất
    cb(null, filename)
  },
})

// Middleware để upload một file duy nhất
const upload = multer({ storage: storage })

module.exports = upload
