import express from "express";
import { authenticateIsMe } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getPostsByUserId,
  createPost,
  deletePost,
  getPublicPostsByUserId,
  getAllPublicPostsWithUser,
} from "../controllers/postController.js";

const router = express.Router();

// Route lấy danh sách post public của tất cả user
router.get("/public", getAllPublicPostsWithUser);

// Route lấy danh sách post public của user có id
router.get("/public/user/:id", getPublicPostsByUserId);

// Route tạo post
router.post(
  "/create",
  authenticateIsMe,
  upload.single("post-image"),
  createPost
);

// Route xóa post
router.delete("/:id", authenticateIsMe, deletePost);

// Route lấy các post của user ID
router.get("/user/:id", authenticateIsMe, getPostsByUserId);

export default router;
