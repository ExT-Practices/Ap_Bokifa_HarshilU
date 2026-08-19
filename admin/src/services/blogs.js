import api from "./api";

// GET ALL BLOGS
export const getBlogs = () => {
    return api.get("/blogs");
};

// GET SINGLE BLOG
export const getBlogById = (id) => {
    return api.get(`/blogs/${id}`);
};

// ADD BLOG
export const addBlog = (data) => {
    return api.post("/blogs", data);
};

// UPDATE BLOG
export const updateBlog = (id, data) => {
    return api.put(`/blogs/${id}`, data);
};

// DELETE BLOG
export const deleteBlog = (id) => {
    return api.delete(`/blogs/${id}`);
};