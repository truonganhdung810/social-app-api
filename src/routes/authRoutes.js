import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name }); // hoặc thông tin cần thiết
});

router.post("/login", login);

export default router;
