import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

export const PostModel = {
  // Tạo bài viết mới
  async create(newPost) {
    const { userId, content, imageUrl, visibility } = newPost;
    console.log("du lieu new post", userId, content, imageUrl, visibility);
    const [result] = await db.execute(
      "INSERT INTO posts (user_id, content, image, visibility) VALUES (?, ?, ?, ?)",
      [userId, content, imageUrl, visibility]
    );

    const insertId = result.insertId;
    const [rows] = await db.execute("SELECT * FROM posts WHERE id = ?", [
      insertId,
    ]);
    console.log("🔥 Row trả về từ DB:", rows[0]);
    return rows[0];
  },

  // Sửa bài viết
  async update(editPost) {
    const { postId, userId, content, visibility = "public" } = editPost;
    const [result] = await db.execute(
      "UPDATE posts SET content = ?, visibility = ? WHERE id = ? AND user_id = ?",
      [content, visibility, postId, userId]
    );
    return result.affectedRows > 0;
  },

  // Xoá bài viết
  async delete(postId, userId) {
    console.log("User", userId, "Post", postId);
    const [result] = await db.execute(
      "DELETE FROM posts WHERE id = ? AND user_id = ?",
      [postId, userId]
    );
    return result.affectedRows > 0;
  },

  async deleteAsAdmin(postId) {
    const [result] = await db.execute("DELETE FROM posts WHERE id = ?", [
      postId,
    ]);
    return result.affectedRows > 0;
  },

  // (tuỳ chọn) Lấy bài viết
  async getById(postId) {
    console.log("Query: ", "SELECT * FROM posts WHERE id = ", postId);
    const [rows] = await db.execute("SELECT * FROM posts WHERE id = ?", [
      postId,
    ]);
    return rows[0];
  },

  async getPostsByUserId(userId) {
    const sql = `
      SELECT posts.id, posts.content, posts.image, posts.visibility, posts.created_at,
             users.name, users.avatar, users.ava_offsetX, users.ava_offsetY, users.ava_width
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = ?
      ORDER BY posts.created_at DESC
    `;

    try {
      const [rows] = await db.execute(sql, [userId]);
      return rows;
    } catch (error) {
      console.error("Error fetching posts by userId:", error);
      throw error;
    }
  },

  async getPublicPostsByUserId(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM posts WHERE user_id = ? AND visibility = "public" ORDER BY created_at DESC',
      [userId]
    );
    console.log("User Id", userId)
    console.log("Danh sach post public", rows)
    return rows;
  },

  async getPublicFriendPostByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT * FROM posts WHERE user_id = ? AND visibility IN ('public', 'friends') ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  // Lấy tất cả post công khai
  async getAllPublicPosts() {
    const [posts] = await db.execute(
      "SELECT id, user_id, content, image, created_at FROM posts WHERE visibility = 'public' ORDER BY created_at DESC"
    );
    return posts;
  },

  async getAllPublicPostsWithUser() {
    const [rows] = await db.execute(`
    SELECT
      posts.id AS post_id,
      posts.content,
      posts.image,
      posts.visibility,
      posts.created_at,

      users.id AS user_id,
      users.name AS user_name,
      users.avatar AS user_avatar,
      users.ava_width,
      users.ava_offsetX,
      users.ava_offsetY

     FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.visibility = 'public'
     ORDER BY posts.created_at DESC
    `);

    return rows.map((row) => ({
      id: row.post_id,
      content: row.content,
      image: row.image,
      visibility: row.visibility,
      created_at: row.created_at,
      user: {
        id: row.user_id,
        name: row.user_name,
        avatar: row.user_avatar,
        ava_width: row.ava_width,
        ava_offsetX: row.ava_offsetX,
        ava_offsetY: row.ava_offsetY,
      },
    }));
  },

  async getAllPublicFriendPosts() {
    const [rows] = await db.execute(`
    SELECT
      posts.id AS post_id,
      posts.content,
      posts.image,
      posts.visibility,
      posts.created_at,

      users.id AS user_id,
      users.name AS user_name,
      users.avatar AS user_avatar,
      users.ava_width,
      users.ava_offsetX,
      users.ava_offsetY

     FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.visibility IN ('public', 'friends')
     ORDER BY posts.created_at DESC
    `);

    return rows.map((row) => ({
      id: row.post_id,
      content: row.content,
      image: row.image,
      visibility: row.visibility,
      created_at: row.created_at,
      user: {
        id: row.user_id,
        name: row.user_name,
        avatar: row.user_avatar,
        ava_width: row.ava_width,
        ava_offsetX: row.ava_offsetX,
        ava_offsetY: row.ava_offsetY,
      },
    }));
  },

  async getPublicAndFriendPostsByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT * FROM posts WHERE user_id = ? AND visibility IN ('public', 'friends') ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },
};
