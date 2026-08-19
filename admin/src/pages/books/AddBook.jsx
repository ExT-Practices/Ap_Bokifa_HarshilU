import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { BookOpen, Upload, ArrowLeft, CheckCircle, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { notifyDataChange } from "../../utils/sync";

const AddBook = () => {
  const navigate = useNavigate();

  const [authors, setAuthors] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [book, setBook] = useState({
    title: "",
    author_id: "",
    category_id: "1",
    price: "",
    stock: "10",
    isbn: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoadingAuthors(true);
      const response = await api.get("/authors");
      const data = Array.isArray(response.data) ? response.data : [];
      setAuthors(data);
      if (data.length > 0) {
        setBook((prev) => ({ ...prev, author_id: data[0].id || data[0].author_id }));
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
      toast.error("Failed to load authors list.");
    } finally {
      setLoadingAuthors(false);
    }
  };

  const handleChange = (e) => {
    setBook({
      ...book,
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
        setBook((prev) => ({ ...prev, image: res.data.image }));
        toast.success("Cover image uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload cover image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!book.title.trim()) {
      toast.error("Book title is required.");
      return;
    }
    if (!book.author_id) {
      toast.error("Please select an author.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        author_id: Number(book.author_id),
        title: book.title.trim(),
        isbn: book.isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
        category_id: book.category_id,
        price: parseFloat(book.price) || 0,
        stock: parseInt(book.stock) || 0,
        description: book.description,
        image: book.image || "",
      };

      await api.post("/books", payload);
      toast.success("Book added successfully!");
      notifyDataChange("BOOKS");
      navigate("/admin/books");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error(error.response?.data?.message || "Failed to add book.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-extrabold text-slate-900">Add New Book</h1>
            <p className="text-xs text-slate-500 mt-0.5">Publish a new title into your store inventory</p>
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
                      alt="Cover Preview"
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
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to upload cover</p>
                      <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
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
                <p className="text-xs text-indigo-600 font-semibold text-center animate-pulse">
                  Uploading image to server...
                </p>
              )}
            </div>

            {/* Main Form Fields (2 Columns) */}
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
                  placeholder="e.g. The Great Gatsby"
                  required
                  className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                    {loadingAuthors ? (
                      <option value="">Loading authors...</option>
                    ) : authors.length === 0 ? (
                      <option value="">No authors available</option>
                    ) : (
                      authors.map((a) => (
                        <option key={a.id || a.author_id} value={a.id || a.author_id}>
                          {a.author_name || a.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Category / Genre
                  </label>
                  <select
                    name="category_id"
                    value={book.category_id}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="1">Fiction & Novel</option>
                    <option value="2">Business & Money</option>
                    <option value="3">Self Improvement</option>
                    <option value="4">Science & Tech</option>
                    <option value="5">History & Biography</option>
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
                    placeholder="499"
                    required
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={book.stock}
                    onChange={handleChange}
                    placeholder="10"
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
                    placeholder="978-0123456789"
                    className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Synopsis / Description
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={book.description}
                  onChange={handleChange}
                  placeholder="Provide a compelling overview of this book..."
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
              disabled={submitting}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? "Saving Book..." : "Publish Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;