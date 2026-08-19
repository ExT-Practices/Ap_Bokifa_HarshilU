const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/stats", (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM books) AS books,
      (SELECT COUNT(*) FROM authors) AS authors,
      (SELECT COUNT(*) FROM blogs) AS blogs,
      (SELECT COUNT(DISTINCT category_id) FROM books WHERE category_id IS NOT NULL AND category_id != 0 AND category_id != '') AS categories
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Dashboard stats query error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    const data = result[0] || {};

    res.json({
      books: data.books || 0,
      totalBooks: data.books || 0,
      authors: data.authors || 0,
      totalAuthors: data.authors || 0,
      blogs: data.blogs || 0,
      totalBlogs: data.blogs || 0,
      categories: data.categories || 0,
      totalCategories: data.categories || 0,
    });
  });
});

module.exports = router;