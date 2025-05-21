import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Thêm thông tin user vào request
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export const authenticateUpload = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  const id = req.headers.id

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.id == id) {
      req.user = decoded // Thêm thông tin user vào request
      next()
    } else return res.status(401).json({ message: 'Invalid or expired token' })
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  res.status(403).json({ message: 'Access denied: Admins only' })
}
