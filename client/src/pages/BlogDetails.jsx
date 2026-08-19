import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaShareAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs/${id}`);
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!data) {
        setError("Blog article not found");
        return;
      }
      setBlog(data);
    } catch (err) {
      console.error("Error fetching blog details:", err);
      setError("Failed to load article.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 font-medium text-sm">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-5 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Article Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">{error || "The requested article could not be found."}</p>
        <Link to="/blogs" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
          <FaArrowLeft /> Back to Blogs
        </Link>
      </div>
    );
  }

  const author = blog.author || blog.authorName || "Editorial Team";
  const image = blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000";
  const date = blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "Recent Post";

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-5">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-purple-600 mb-8 transition">
          <FaArrowLeft /> Back to Articles
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1.5 text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                <FaUser className="w-3 h-3" /> By {author}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt /> {date}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              {blog.title}
            </h1>
          </div>

          <div className="h-96 rounded-2xl overflow-hidden shadow-md">
            <img src={image} alt={blog.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed text-base space-y-4">
            <p className="text-lg font-medium text-gray-800 italic border-l-4 border-purple-500 pl-4 py-1 bg-purple-50/50 rounded-r-xl">
              {blog.description || "Discover fresh insights and perspectives in this literary article."}
            </p>
            <div className="whitespace-pre-line">
              {blog.content || "Full article body content published by the admin."}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-between items-center">
            <Link to="/blogs" className="text-sm font-semibold text-purple-600 hover:underline">
              ← Explore more articles
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-purple-600 bg-gray-100 px-4 py-2 rounded-xl transition"
            >
              <FaShareAlt /> Share Article
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

export default BlogDetails;