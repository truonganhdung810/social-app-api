import express from "express";
import { login } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name }); // hoặc thông tin cần thiết
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true nếu dùng HTTPS
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
});

router.post("/login", login);

export default router;
