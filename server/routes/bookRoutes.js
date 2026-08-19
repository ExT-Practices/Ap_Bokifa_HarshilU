const express = require("express");
const db = require("../config/db");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

router.get("/", getBooks);

router.get("/:id", getBookById);

router.post("/", verifyToken, addBook);

router.put("/:id", verifyToken, updateBook);

router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteBook);

router.get("/", (req, res) => {
  const sql = `
    SELECT
      b.*,
      a.name AS authorName
    FROM books b
    LEFT JOIN authors a
      ON b.author_id = a.id
    ORDER BY b.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(result);
  });
});

// Add New Book
router.post("/", (req, res) => {
  const {
    title,
    author_id,
    category_id,
    price,
    stock,
    description,
    image,
  } = req.body;

  const sql = `
    INSERT INTO books
    (title, author_id, category_id, price, stock, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      author_id,
      category_id,
      price,
      stock,
      description,
      image,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Book added successfully",
        id: result.insertId,
      });
    }
  );
});

module.exports = router;