import { UserModel } from "../models/user.js";
import { PostModel } from "../models/post.js";

export const uploadCover = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.body.name;
    // Nếu đúng user, thực hiện lưu file);
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // Lưu file vào database
    const fileUrl = `http://localhost:4000/uploads/images/${req.file.filename}`;
    console.log("Cover url", fileUrl);
    const cover = {
      id: userId,
      cover_photo: fileUrl,
      offsetx: req.body.offsetX,
      offsety: req.body.offsetY,
    };
    const message = await UserModel.updateCover(cover);
    console.log("Update Cover", message);

    const content = `${userName} updated the cover photo`;
    const coverPost = {
      userId: userId,
      content,
      imageUrl: fileUrl,
      visibility: "public",
    };

    const result = await PostModel.create(coverPost);

    if (result && result.id) {
      return res.json({
        message: "OK",
        user_id: userId,
        fileUrl: fileUrl,
        file: req.file,
        id: result.id,
        created_at: result.created_at,
        content,
      });
    } else {
      return res.json({ message: "Failed to update cover" });
    }
    // Trả về thông tin file đã upload
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    // Lấy ID từ URL
    const userId = req.user.id;
    const userName = req.body.name;
    console.log("User Name", userName);
    // Nếu đúng user, thực hiện lưu file
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // Lưu file vào database
    const fileUrl = `http://localhost:4000/uploads/images/${req.file.filename}`;
    console.log("Avatar url", fileUrl);
    const avatar = {
      id: userId,
      avatar_src: fileUrl,
      offsetx: req.body.offsetx,
      offsety: req.body.offsety,
      ava_width: req.body.cropwidth,
    };

    const message = await UserModel.updateAvatar(avatar);
    console.log("Update Avatar", message);

    const content = `${userName} updated the profile photo`;
    const avatarPost = {
      userId: userId,
      content,
      imageUrl: fileUrl,
      visibility: "public",
    };
    console.log(avatarPost);

    const result = await PostModel.create(avatarPost);

    if (result && result.id) {
      return res.json({
        message: "OK",
        user_id: userId,
        fileUrl: fileUrl,
        file: req.file,
        id: result.id,
        created_at: result.created_at,
        content,
      });
    } else {
      return res.json({ message: "Failed to update avatar" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const userId = req.user.id; // middleware đã gán user vào req.user
    const { content, image_url } = req.body;

    if (!content && !image_url) {
      return res
        .status(400)
        .json({ message: "Post must have content or image" });
    }

    const [result] = await db.execute(
      "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
      [userId, content, image_url]
    );

    return res.status(201).json({
      message: "Post created successfully",
      postId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
