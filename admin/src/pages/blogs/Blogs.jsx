import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getBlogs, deleteBlog } from "../../services/blogs";
import { FileText, Plus, Search, Edit, Trash2, Clock, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { notifyDataChange } from "../../utils/sync";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBlogsList = async () => {
    try {
      setLoading(true);
      const res = await getBlogs();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBlogs(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blog articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsList();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this blog post?");
    if (!confirmDelete) return;

    try {
      await deleteBlog(id);
      toast.success("Blog article deleted successfully!");
      notifyDataChange("BLOGS");
      fetchBlogsList();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete blog article.");
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const title = (b.title || "").toLowerCase();
    const author = (b.author || b.authorName || "").toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = title.includes(q) || author.includes(q);
    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading blog articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Content Studio
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            Blog Posts & Articles
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Publish news, reading guides, book reviews, and literary tips.
          </p>
        </div>

        <Link
          to="/admin/blogs/add"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-purple-500/20 transition active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" /> Publish New Article
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search article by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-sm text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-sm text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No blog articles found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || statusFilter ? "No article matches your current search filters." : "Publish your first blog article to engage readers."}
          </p>
          <Link
            to="/admin/blogs/add"
            className="inline-flex items-center gap-2 mt-5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> Publish Article
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => {
            const blogId = blog.id || blog.blog_id;
            const isPublished = blog.status === "Published";

            return (
              <div
                key={blogId}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img
                      src={blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className={`absolute top-3 right-3 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-xs ${
                      isPublished
                        ? "bg-emerald-500/90 text-white"
                        : "bg-slate-800/80 text-slate-200"
                    }`}>
                      {blog.status || "Published"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.authorName || blog.author || "Admin"}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-purple-600 transition">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                      {blog.description || blog.content || "No excerpt content available."}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100/80 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    #{blogId}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/blogs/edit/${blogId}`)}
                      className="px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-xs font-semibold transition"
                    >
                      Edit Post
                    </button>
                    <button
                      onClick={() => handleDelete(blogId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Blogs;