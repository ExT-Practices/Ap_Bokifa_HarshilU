import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import BlogCard from "../components/BlogCard";
import { FiSearch, FiFileText } from "react-icons/fi";

import { subscribeToDataChanges } from "../utils/sync";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBlogs();
    const unsubscribe = subscribeToDataChanges(fetchBlogs, 3000);
    return () => unsubscribe();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs");
      const data = Array.isArray(res.data) ? res.data : [];
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const title = (blog.title || "").toLowerCase();
    const author = (blog.author || blog.authorName || "").toLowerCase();
    const q = search.toLowerCase();
    return title.includes(q) || author.includes(q);
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-5">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 font-medium text-sm">Loading blog articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xs">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800">No blog articles found</h3>
            <p className="text-gray-500 text-sm mt-1">Check back soon for new articles published by admin.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id || blog.blog_id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;