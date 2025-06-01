import express from "express";
import {
  authenticateIsMe,
  authenticateToken,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getPostsByUserId,
  createPost,
  deletePost,
  getPublicFriendPostByUserId,
  getAllPublicPostsWithUser,
  getAllPublicFriendPosts,
} from "../controllers/postController.js";

const router = express.Router();

// Route lấy danh sách post public của tất cả user
router.get("/public", getAllPublicPostsWithUser);

// Route lấy danh sách post public và friend của toàn bộ user
router.get("/public-friend/", authenticateToken, getAllPublicFriendPosts);

// Route lấy danh sách post public và friend của user có id
router.get(
  "/public-friend/user/:id",
  authenticateToken,
  getPublicFriendPostByUserId
);

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
