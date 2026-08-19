const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    getAuthorById
} = require("../controllers/authorController");

// GET all authors
router.get("/", getAuthors);

// GET single author
router.get("/:id", getAuthorById);

// ADD author
router.post("/", verifyToken, addAuthor);

// UPDATE author
router.put("/:id", verifyToken, updateAuthor);

// DELETE author
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteAuthor);


module.exports = router;