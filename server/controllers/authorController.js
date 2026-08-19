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

// GET ALL AUTHORS
const getAuthors = (req, res) => {
    const sql = `
        SELECT *
        FROM authors
        ORDER BY author_id DESC
    `;

    db.query("CALL sp_get_authors()", (err, result) => {
        if (err || !result) {
            db.query(sql, (err2, result2) => {
                if (err2) {
                    return res.status(500).json({ success: false, message: err2.message });
                }
                const rows2 = extractRows(result2);
                const mapped = rows2.map(a => ({
                    ...a,
                    id: a.author_id || a.id,
                    author_name: a.author_name || a.name || "Unknown Author"
                }));
                return res.json(mapped);
            });
            return;
        }

        const rows = extractRows(result);
        const mapped = rows.map(a => ({
            ...a,
            id: a.author_id || a.id,
            author_name: a.author_name || a.name || "Unknown Author"
        }));

        res.json(mapped);
    });
};

// GET AUTHOR BY ID
const getAuthorById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT *
        FROM authors
        WHERE author_id = ? OR id = ?
    `;

    db.query(sql, [id, id], (err, result) => {
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
                message: "Author not found"
            });
        }

        const author = rows[0];
        res.json({
            ...author,
            id: author.author_id || author.id,
            author_name: author.author_name || author.name || "Unknown Author"
        });
    });
};


// ADD AUTHOR
const addAuthor = (req, res) => {

    const {
        author_name,
        name,
        email,
        phone,
        bio
    } = req.body;

    const authorName = author_name || name;

    if (!authorName) {
        return res.status(400).json({
            success: false,
            message: "Author name is required"
        });
    }

    const sql = `
        INSERT INTO authors
        (author_name, email, phone, bio)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [authorName, email || "", phone || "", bio || ""],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Author added successfully",
                id: result.insertId
            });
        }
    );
};


// UPDATE AUTHOR
const updateAuthor = (req, res) => {

    const { id } = req.params;

    const {
        author_name,
        name,
        email,
        phone,
        bio
    } = req.body;

    const authorName = author_name || name;

    if (!authorName) {
        return res.status(400).json({
            success: false,
            message: "Author name is required"
        });
    }

    const sql = `
        UPDATE authors
        SET
            author_name = ?,
            email = ?,
            phone = ?,
            bio = ?
        WHERE author_id = ?
    `;

    db.query(
        sql,
        [authorName, email || "", phone || "", bio || "", id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Author not found"
                });
            }

            res.json({
                success: true,
                message: "Author updated successfully"
            });
        }
    );
};


// DELETE AUTHOR
const deleteAuthor = (req, res) => {
    const { id } = req.params;

    db.query("CALL sp_delete_author(?)", [id], (err) => {
        if (err) {
            db.query("DELETE FROM authors WHERE author_id = ?", [id], (err2) => {
                if (err2) {
                    if (err2.errno === 1451 || err2.code === "ER_ROW_IS_REFERENCED_2") {
                        db.query("DELETE FROM books WHERE author_id = ?", [id], () => {
                            db.query("DELETE FROM authors WHERE author_id = ?", [id], (err3) => {
                                if (err3) {
                                    return res.status(500).json({ success: false, message: err3.message });
                                }
                                return res.json({ success: true, message: "Author deleted successfully" });
                            });
                        });
                        return;
                    }
                    return res.status(500).json({ success: false, message: err2.message });
                }
                return res.json({ success: true, message: "Author deleted successfully" });
            });
            return;
        }

        res.json({ success: true, message: "Author deleted successfully" });
    });
};


module.exports = {
    getAuthors,
    getAuthorById,
    addAuthor,
    updateAuthor,
    deleteAuthor
};