import api from "./api";

// GET ALL BOOKS
export const getBooks = () => {
    return api.get("/books");
};

// GET SINGLE BOOK
export const getBookById = (id) => {
    return api.get(`/books/${id}`);
};

// ADD BOOK
export const addBook = (data) => {
    return api.post("/books", data);
};

// UPDATE BOOK
export const updateBook = (id, data) => {
    return api.put(`/books/${id}`, data);
};

// DELETE BOOK
export const deleteBook = (id) => {
    return api.delete(`/books/${id}`);
};