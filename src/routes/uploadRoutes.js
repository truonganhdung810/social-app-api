import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadCover } from "../controllers/uploadController.js";

const router = express.Router();

// Route upload Cover
router.post(
  "/cover",
  authenticateToken,
  upload.single("cover-image"),
  uploadCover
);

router.post("/", (req, res) => {
  res.json({ message: "Upload" });
});

router.get("/", (req, res) => {
  res.json({ message: "Upload" });
});

export default router;
