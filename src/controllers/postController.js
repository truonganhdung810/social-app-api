import { PostModel } from "../models/post.js";

export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, image_url, visibility = "public" } = req.body;

    const allowedVisibilities = ["public", "friends", "private"];
    if (!allowedVisibilities.includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility option" });
    }

    if (!content && !image_url) {
      return res
        .status(400)
        .json({ message: "Post must have content or image" });
    }

    const result = await PostModel.create(
      userId,
      content,
      image_url,
      visibility
    );

    if (result.affectedRows === 1) {
      const postId = result.insertId;
      return res.status(201).json({
        message: "OK",
        post_id: postId,
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
    const userId = req.user.id;
    const userRole = req.user.role; // middleware phải gán role vào req.user
    const postId = req.params.id;

    let deleted = false;

    if (userRole === "admin") {
      // Admin xoá post không cần điều kiện user_id
      deleted = await PostModel.deleteAsAdmin(postId);
    } else {
      // Người dùng thường chỉ được xoá post của chính họ
      deleted = await PostModel.delete(postId, userId);
    }

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Post not found or permission denied" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Internal server error" });
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
