import express from "express";
import { dataController, createPost, getAllUser, getUserById, deletePost, getAllPosts, updatePost } from "../controllers/dataController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/user", dataController);
router.post("/post", createPost);
router.get("/all", getAllUser);
router.get("/user/:id", getUserById);
router.delete("/post/:id", authenticateToken, deletePost)
router.get("/all-posts", getAllPosts)
router.put("/post/:id", updatePost)

export default router;