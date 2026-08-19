import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { BookOpen, ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import toast from "react-hot-toast";
import { notifyDataChange } from "../../utils/sync";

const DEFAULT_CATEGORIES = [
  { id: 1, name: "Novel & Fiction" },
  { id: 2, name: "Business & Money" },
  { id: 3, name: "Self Improvement" },
  { id: 4, name: "Science & Tech" },
];

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author_id: "",
    category_id: "1",
    isbn: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookRes, authorsRes] = await Promise.all([
        api.get(`/books/${id}`),
        api.get("/authors").catch(() => ({ data: [] })),
      ]);

      const bookData = Array.isArray(bookRes.data)
        ? bookRes.data[0]
        : (bookRes.data?.data || bookRes.data);

      if (!bookData) {
        toast.error("Book not found.");
        navigate("/admin/books");
        return;
      }

      setBook({
        title: bookData.title || "",
        author_id: bookData.author_id || bookData.authorId || "",
        category_id: bookData.category_id || bookData.categoryId || "1",
        isbn: bookData.isbn || "",
        price: bookData.price ?? "",
        stock: bookData.stock ?? "",
        description: bookData.description || "",
        image: bookData.image || "",
      });

      if (bookData.image) {
        setImagePreview(bookData.image);
      }

      setAuthors(Array.isArray(authorsRes.data) ? authorsRes.data : []);
    } catch (error) {
      console.error("Failed to load book edit details:", error);
      toast.error("Failed to load book details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.image) {
        setBook((prev) => ({ ...prev, image: res.data.image }));
        toast.success("New cover image uploaded!");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!book.title.trim()) {
      toast.error("Book title is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: book.title.trim(),
        author_id: Number(book.author_id),
        category_id: book.category_id,
        isbn: book.isbn,
        price: Number(book.price) || 0,
        stock: Number(book.stock) || 0,
        description: book.description,
        image: book.image,
      };

      await api.put(`/books/${id}`, payload);
      toast.success("Book updated successfully!");
      notifyDataChange("BOOKS");
      navigate("/admin/books");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update book.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Fetching book details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/books"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Books Catalog
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Edit Book Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5">Modify pricing, stock inventory, or author information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Cover Image Upload Column */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Book Cover Image
              </label>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-indigo-500 transition relative bg-slate-50 flex flex-col items-center justify-center min-h-[260px]">
                {imagePreview || book.image ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={imagePreview || book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md">
                        Change Cover
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to replace image</p>
                      <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {uploading && (
                <p className="text-xs text-indigo-600 font-semibold text-center animate-pulse">
                  Uploading image to server...
                </p>
              )}
            </div>

            {/* Main Form Fields */}
            <div className="md:col-span-2 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Book Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                />
              </div>

              {/* Author & Category Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Author <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="author_id"
                    value={book.author_id}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Select Author</option>
                    {authors.map((a) => (
                      <option key={a.id || a.author_id} value={a.id || a.author_id}>
                        {a.author_name || a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={book.category_id}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Stock, ISBN Grid */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={book.price}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={book.stock}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    ISBN Code
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={book.isbn}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={book.description}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/books")}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition disabled:opacity-50 flex items-center gap-2"
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

export default EditBook;