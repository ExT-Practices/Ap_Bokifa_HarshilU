import api from "./api";


// GET AUTHORS
export const getAuthors = () => {
    return api.get("/authors");
};


// GET AUTHOR
export const getAuthorById = (id) => {
    return api.get(`/authors/${id}`);
};


// ADD AUTHOR
export const addAuthor = (data) => {
    return api.post("/authors", data);
};


// UPDATE AUTHOR
export const updateAuthor = (id, data) => {
    return api.put(`/authors/${id}`, data);
};


// DELETE AUTHOR
export const deleteAuthor = (id) => {
    return api.delete(`/authors/${id}`);
};