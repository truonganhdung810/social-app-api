import { UserModel } from '../models/user.js'

export const uploadCover = async (req, res) => {
  try {
    // Lấy ID từ URL
    const userId = req.headers.id
    // Nếu đúng user, thực hiện lưu file
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }
    // Lưu file vào database
    const cover = {
      id: userId,
      cover_photo: req.file.path,
      offsetx: req.headers.offsetx,
      offsety: req.headers.offsety,
    }
    const message = await UserModel.updateCover(cover)
    console.log('Update Cover', message)

    // Trả về thông tin file đã upload
    return res.json({
      message: 'File uploaded successfully!',
      id: userId,
      file: req.file,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
