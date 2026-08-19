import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

import AdminLayout from "../layouts/AdminLayout";

import Books from "../pages/books/Books";
import AddBook from "../pages/books/AddBook";
import EditBook from "../pages/books/EditBook";

import Authors from "../pages/authors/Authors";
import AddAuthor from "../pages/authors/AddAuthor";
import EditAuthor from "../pages/authors/EditAuthor";

import Blogs from "../pages/blogs/Blogs";
import AddBlog from "../pages/blogs/AddBlog";
import EditBlog from "../pages/blogs/EditBlog";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Redirect */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="books" element={<Books />} />
                <Route path="books/add" element={<AddBook />} />
                <Route path="books/edit/:id" element={<EditBook />} />
                <Route path="authors" element={<Authors />} />
                <Route path="authors/add" element={<AddAuthor />} />
                <Route path="authors/edit/:id" element={<EditAuthor />} />
                <Route path="blogs" element={<Blogs />}/>
                <Route path="blogs/add" element={<AddBlog />}/>
                <Route path="blogs/edit/:id" element={<EditBlog />}/>
            </Route>
        </Routes>
    );
};

export default AppRoutes;