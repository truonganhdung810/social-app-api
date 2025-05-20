const multer = require('multer')
const path = require('path')

// Cấu hình storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Đặt thư mục lưu ảnh
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Đặt tên file là thời gian hiện tại cộng với tên file gốc
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

// Tạo middleware multer để xử lý upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn dung lượng file (5MB)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  },
}).single('image') // 'image' là tên trường gửi file từ client

module.exports = upload
