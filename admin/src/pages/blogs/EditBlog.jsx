import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getBlogById, updateBlog } from "../../services/blogs";
import api from "../../services/api";
import { FileText, ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import toast from "react-hot-toast";
import { notifyDataChange } from "../../utils/sync";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    author: "Admin",
    status: "Published",
    content: "",
    image: "",
  });

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogRes, authorsRes] = await Promise.all([
        getBlogById(id),
        api.get("/authors").catch(() => ({ data: [] })),
      ]);

      const blogData = Array.isArray(blogRes.data)
        ? blogRes.data[0]
        : (blogRes.data?.data || blogRes.data);

      if (!blogData) {
        toast.error("Blog article not found.");
        navigate("/admin/blogs");
        return;
      }

      setBlog({
        title: blogData.title || "",
        author: blogData.author || blogData.authorName || "Admin",
        status: blogData.status || "Published",
        content: blogData.content || blogData.description || "",
        image: blogData.image || "",
      });

      if (blogData.image) {
        setImagePreview(blogData.image);
      }

      setAuthors(Array.isArray(authorsRes.data) ? authorsRes.data : []);
    } catch (error) {
      console.error("Failed to load blog:", error);
      toast.error("Failed to load article details.");
    } fontally: {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.image) {
        setBlog((prev) => ({ ...prev, image: res.data.image }));
        toast.success("Article cover updated!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload cover image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!blog.title.trim()) {
      toast.error("Please enter blog title.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: blog.title.trim(),
        author: blog.author || "Admin",
        status: blog.status || "Published",
        content: blog.content || "",
        description: blog.content || "",
        image: blog.image || "",
      };

      await updateBlog(id, payload);
      toast.success("Blog article updated successfully!");
      notifyDataChange("BLOGS");
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update blog.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading blog article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/blogs"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles List
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Edit Blog Article</h1>
            <p className="text-xs text-slate-500 mt-0.5">Modify article title, content body, or status</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Cover Image Upload Column */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Header Cover Image
              </label>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-purple-500 transition relative bg-slate-50 flex flex-col items-center justify-center min-h-[240px]">
                {imagePreview || blog.image ? (
                  <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={imagePreview || blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md">
                        Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to upload cover</p>
                      <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {uploadingImage && (
                <p className="text-xs text-purple-600 font-semibold text-center animate-pulse">
                  Uploading image to server...
                </p>
              )}
            </div>

            {/* Main Form Fields */}
            <div className="md:col-span-2 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={blog.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-semibold"
                />
              </div>

              {/* Author & Status Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Author / Byline
                  </label>
                  <select
                    name="author"
                    value={blog.author}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="Editorial Team">Editorial Team</option>
                    <option value="Admin">Admin Studio</option>
                    {authors.map((a) => (
                      <option key={a.id || a.author_id} value={a.author_name || a.name}>
                        {a.author_name || a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Publication Status
                  </label>
                  <select
                    name="status"
                    value={blog.status}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-semibold"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Article Content / Story Body
                </label>
                <textarea
                  name="content"
                  value={blog.content}
                  onChange={handleChange}
                  rows="6"
                  className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/blogs")}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-500/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;