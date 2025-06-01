import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser"; // nhớ gọi app.use(cookieParser())

export const authenticateTokenCookie = (req, res, next) => {
  // Lấy token từ cookie thay vì header
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Giữ lại thông tin user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authenticateToken = (req, res, next) => {
  // 1. Lấy token từ cookie
  let token = req.cookies?.token;

  // 2. Nếu không có, thử lấy từ Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  console.log("Token", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Thêm thông tin user vào request
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authenticateUpload = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authenticateIsMe = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const id = req.headers.id;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(id, "decode id", decoded.id);
    if (decoded.id == id) {
      req.user = decoded; // Thêm thông tin user vào request
      next();
    } else return res.status(401).json({ message: "Invalid or expired token" });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Access denied: Admins only" });
};
