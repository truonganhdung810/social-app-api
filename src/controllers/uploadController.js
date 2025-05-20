import { UserModel } from "../models/user.js";

export const uploadCover = async (req, res) => {
  try {
    // Lấy ID từ token (được middleware authenticateToken gán vào req.user)
    const tokenUserId = req.user.id;
    console.log("Token id", tokenUserId);

    // Lấy ID từ URL
    const userId = req.user.id;
    console.log("ID", userID);

    // Tìm user trong database
    const user = await UserModel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (tokenUserId == userId) {
      // Nếu đúng user, thực hiện lưu file
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      // Trả về thông tin file đã upload
      res.json({
        message: "File uploaded successfully!",
        id: userId,
        file: req.file,
      });
    } else {
      // Nếu không đúng user, trả về fail
      return res.json({ message: "Can't upload file!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
