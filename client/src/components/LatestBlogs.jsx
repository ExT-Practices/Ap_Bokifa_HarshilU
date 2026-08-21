import { useEffect, useState } from "react";
import api from "../services/api";
import BlogCard from "./BlogCard";
import { Link } from "react-router-dom";

import { subscribeToDataChanges } from "../utils/sync";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestBlogs();
    const unsubscribe = subscribeToDataChanges(fetchLatestBlogs, 3000);
    return () => unsubscribe();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs");
      const data = Array.isArray(res.data) ? res.data : [];
      setBlogs(data.slice(0, 3));
    } catch (err) {
      console.error("Failed to load latest blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center mb-14">
          <div>
            <p className="text-green-600 font-bold text-sm tracking-wider uppercase">
              Our Blog
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-gray-900">
              Latest Articles
            </h2>
            <p className="text-gray-500 mt-3 text-sm">
              Stay updated with book news, literary tips, and author updates.
            </p>
          </div>

          <Link
            to="/blogs"
            className="hidden sm:inline-flex border-2 border-green-600 text-green-600 font-bold px-7 py-3 rounded-full hover:bg-green-600 hover:text-white duration-300 text-sm"
          >
            View All Articles
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 font-medium">Loading articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            No articles published yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id || blog.blog_id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogs;