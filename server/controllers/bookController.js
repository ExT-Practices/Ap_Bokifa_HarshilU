const db = require("../config/db");

const extractRows = (result) => {
    if (!result) return [];
    if (Array.isArray(result)) {
        if (result.length > 0 && Array.isArray(result[0])) {
            return result[0];
        }
        return result;
    }
    return [];
};

// GET ALL BOOKS
const getBooks = (req, res) => {
    db.query("CALL sp_get_books()", (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        const baseUrl = process.env.BASE_URL || "http://localhost:5000";
        const rows = extractRows(result);

        const books = rows.map(book => ({
            ...book,
            id: book.book_id || book.id,
            authorName: book.author_name || book.authorName || "Unknown Author",
            image: book.image
                ? (book.image.startsWith("http") ? book.image : `${baseUrl}${book.image.startsWith("/") ? "" : "/"}${book.image}`)
                : null
        }));

        res.status(200).json(books);
    });
};

// GET BOOK BY ID
const getBookById = (req, res) => {
    const id = req.params.id;

    db.query(
        "CALL sp_get_book_by_id(?)",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            const rows = extractRows(result);

            if (!rows || rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Book Not Found"
                });
            }

            const baseUrl = process.env.BASE_URL || "http://localhost:5000";
            const book = rows[0];
            const mappedBook = {
                ...book,
                id: book.book_id || book.id,
                authorName: book.author_name || book.authorName || "Unknown Author",
                image: book.image
                    ? (book.image.startsWith("http") ? book.image : `${baseUrl}${book.image.startsWith("/") ? "" : "/"}${book.image}`)
                    : null
            };

            res.status(200).json(mappedBook);
        }
    );
};

// ADD BOOK

const addBook = (req, res) => {

    const {
        author_id,
        title,
        isbn,
        price,
        stock,
        description,
        image
    } = req.body;

    db.query(
        "CALL sp_add_book(?,?,?,?,?,?,?)",
        [
            author_id,
            title,
            isbn,
            price,
            stock,
            description,
            image
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Book Added Successfully"
            });

        }
    );

};

// UPDATE BOOK

const updateBook = (req, res) => {

    const id = req.params.id;

    const {
        author_id,
        title,
        isbn,
        price,
        stock,
        description,
        image
    } = req.body;

    db.query(
        "CALL sp_update_book(?,?,?,?,?,?,?,?)",
        [
            id,
            author_id,
            title,
            isbn,
            price,
            stock,
            description,
            image
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(200).json({
                success: true,
                message: "Book Updated Successfully"
            });

        }
    );

};

// DELETE BOOK

const deleteBook = (req, res) => {
    const id = req.params.id;

    db.query("CALL sp_delete_book(?)", [id], (err) => {
        if (err) {
            db.query("DELETE FROM books WHERE book_id = ? OR id = ?", [id, id], (err2) => {
                if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: err2.message
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Book Deleted Successfully"
                });
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Book Deleted Successfully"
        });
    });
};

module.exports = {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
};