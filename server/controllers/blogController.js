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

// GET ALL BLOGS
const getBlogs = (req, res) => {
    db.query("CALL sp_get_blogs()", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        const baseUrl = process.env.BASE_URL || "http://localhost:5000";
        const rows = extractRows(result);

        const blogs = rows.map(blog => ({
            ...blog,
            id: blog.blog_id || blog.id,
            authorName: blog.author || blog.authorName || "Admin",
            description: blog.content || blog.description || "",
            image: blog.image
                ? (blog.image.startsWith("http") ? blog.image : `${baseUrl}${blog.image.startsWith("/") ? "" : "/"}${blog.image}`)
                : null
        }));

        res.json(blogs);
    });
};

// GET BLOG BY ID
const getBlogById = (req, res) => {
    const { id } = req.params;

    db.query("CALL sp_get_blog_by_id(?)", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        const rows = extractRows(result);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const baseUrl = process.env.BASE_URL || "http://localhost:5000";
        const blog = rows[0];

        res.json({
            ...blog,
            id: blog.blog_id || blog.id,
            authorName: blog.author || blog.authorName || "Admin",
            description: blog.content || blog.description || "",
            image: blog.image
                ? (blog.image.startsWith("http") ? blog.image : `${baseUrl}${blog.image.startsWith("/") ? "" : "/"}${blog.image}`)
                : null
        });
    });
};


// ADD BLOG
const addBlog = (req, res) => {

    const {
        title,
        slug,
        content,
        image,
        author,
        status
    } = req.body;

    const blogSlug = slug || title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "blog-post";

    db.query(
        "CALL sp_add_blog(?,?,?,?,?,?)",
        [
            title,
            blogSlug,
            content || "",
            image || "",
            author || "Admin",
            status || "Published"
        ],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Blog Added Successfully"
            });

        }
    );

};


// UPDATE BLOG
const updateBlog = (req, res) => {

    const { id } = req.params;

    const {
        title,
        slug,
        content,
        image,
        author,
        status
    } = req.body;

    const blogSlug = slug || title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "blog-post";

    db.query(
        "CALL sp_update_blog(?,?,?,?,?,?,?)",
        [
            id,
            title,
            blogSlug,
            content || "",
            image || "",
            author || "Admin",
            status || "Published"
        ],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(200).json({
                success: true,
                message: "Blog Updated Successfully"
            });

        }
    );

};


// DELETE BLOG
const deleteBlog = (req, res) => {
    const { id } = req.params;

    db.query("CALL sp_delete_blog(?)", [id], (err) => {
        if (err) {
            db.query("DELETE FROM blogs WHERE blog_id = ? OR id = ?", [id, id], (err2) => {
                if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: err2.message
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Blog Deleted Successfully"
                });
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Blog Deleted Successfully"
        });
    });
};


module.exports = {
    getBlogs,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog
};