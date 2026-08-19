const express = require("express");

const router = express.Router();

const {
    getBlogs,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// GET all blogs
router.get("/", getBlogs);

// GET single blog
router.get("/:id", getBlogById);

// ADD blog
router.post("/", verifyToken, addBlog);

// UPDATE blog
router.put("/:id", verifyToken, updateBlog);

// DELETE blog
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteBlog);


module.exports = router;