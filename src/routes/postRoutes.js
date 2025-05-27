import express from "express";
import {
  authenticateIsMe,
  authenticateToken,
} from "../middleware/authMiddleware.js";
import { getPostsByUserId } from "../controllers/postController.js";

const router = express.Router();

// Route mẫu tạo post (sẽ thêm sau)
router.post("/", authenticateToken, (req, res) => {
  res.json({ message: "Post created" });
});

// Route lấy các post của user ID
router.get("/user/:id", authenticateIsMe, getPostsByUserId);

export default router;
