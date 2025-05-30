import { PostModel } from "../models/post.js";
import { UserModel } from "../models/user.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, visibility = "public" } = req.body;

    const allowedVisibilities = ["public", "friends", "private"];
    if (!allowedVisibilities.includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility option" });
    }

    // Nếu có ảnh thì multer đã gán req.file
    const imageUrl = req.file
      ? `http://localhost:4000/uploads/images/${req.file.filename}`
      : null;

    if (!content && !imageUrl) {
      return res
        .status(400)
        .json({ message: "Post must have content or image" });
    }
    console.log(
      "du lieu gui sang Model.create",
      userId,
      content,
      imageUrl,
      visibility
    );
    const result = await PostModel.create({
      userId,
      content,
      imageUrl,
      visibility,
    });

    if (result.affectedRows === 1) {
      return res.status(201).json({
        message: "OK",
        post_id: result.id,
        user_id: result.user_id,
        created_at: result.created_at,
        content: result.content,
        image: result.image,
        visibility: result.visibility,
      });
    } else {
      return res.status(500).json({ message: "Failed to create post" });
    }
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { content, visibility = "public" } = req.body;

    const allowedVisibilities = ["public", "friends", "private"];
    if (!allowedVisibilities.includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility option" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required to update" });
    }

    const updated = await PostModel.update(postId, userId, content, visibility);
    if (!updated) {
      return res
        .status(404)
        .json({ message: "Post not found or not owned by user" });
    }

    res.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";
    console.log("delete function", postId, userId, isAdmin);

    const post = await PostModel.getById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user_id !== userId && !isAdmin) {
      return res.status(403).json({ message: "You cannot delete this post" });
    }

    // Kiểm tra nếu ảnh đang là avatar hoặc cover_photo hiện tại
    if (post.image) {
      const user = await UserModel.findById(post.user_id);

      if (user.avatar === post.image) {
        if (!isAdmin) {
          return res.status(400).json({
            message:
              "Cannot delete image because it is currently used as avatar",
          });
        } else {
          await UserModel.updateAvatar({
            id: user.id,
            avatar_src: null,
            offsetx: 0,
            offsety: 0,
            ava_width: 0,
          });
        }
      }

      if (user.cover_photo === post.image) {
        if (!isAdmin) {
          return res.status(400).json({
            message:
              "Cannot delete image because it is currently used as cover photo",
          });
        } else {
          await UserModel.updateCover({
            id: user.id,
            cover_photo: null,
            offsetx: 0,
            offsety: 0,
          });
        }
      }

      // Luôn xóa ảnh vật lý sau khi xử lý avatar/cover
      const fileName = path.basename(post.image);
      const imagePath = path.join(__dirname, "../uploads/images", fileName);

      fs.access(imagePath, fs.constants.F_OK, (accessErr) => {
        if (accessErr) {
          console.warn("Ảnh không tồn tại:", imagePath);
        } else {
          fs.unlink(imagePath, (err) => {
            if (err) console.warn("Lỗi khi xóa ảnh:", err.message);
            else console.log("Đã xóa ảnh:", fileName);
          });
        }
      });
    }

    // Gọi đúng hàm theo quyền
    const deleted = isAdmin
      ? await PostModel.deleteAsAdmin(postId)
      : await PostModel.delete(postId, userId);

    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete post" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await PostModel.getPostsByUserId(userId);

    return res.status(200).json({
      message: "Fetched user posts successfully",
      posts,
    });
  } catch (err) {
    console.error("Error fetching posts by user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPublicPostsByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const posts = await PostModel.getPublicByUserId(userId);
    res.json(posts);
  } catch (err) {
    console.error("Error getting public posts by user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPublicPosts = async (req, res) => {
  try {
    const posts = await PostModel.getAllPublicPosts();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPublicPostsWithUser = async (req, res) => {
  try {
    const posts = await PostModel.getAllPublicPostsWithUser();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
