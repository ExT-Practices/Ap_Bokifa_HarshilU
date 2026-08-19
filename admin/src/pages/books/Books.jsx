import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Grid,
  List,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import { notifyDataChange } from "../../utils/sync";

function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/books");
      const data = Array.isArray(response.data) ? response.data : [];
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError(err.response?.data?.message || "Failed to load books from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((book) => String(book.id || book.book_id) !== String(id)));
      toast.success("Book deleted successfully!");
      notifyDataChange("BOOKS");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete book.");
    }
  };

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title?.toLowerCase().includes(search.toLowerCase());
    const authorMatch = book.authorName?.toLowerCase().includes(search.toLowerCase()) ||
                        book.author_name?.toLowerCase().includes(search.toLowerCase());
    const authorFilterMatch = selectedAuthor
      ? String(book.author_id) === String(selectedAuthor) || book.authorName === selectedAuthor
      : true;
    return (titleMatch || authorMatch) && authorFilterMatch;
  });

  const authorsList = Array.from(new Set(books.map((b) => b.authorName || b.author_name).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading catalog books...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Catalog Management
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            Books Collection
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage titles, inventory stock, pricing, and book cover media.
          </p>
        </div>

        <Link
          to="/admin/books/add"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-indigo-500/20 transition active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" /> Add New Book
        </Link>
      </div>

      {/* Filter & View Controls Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter by title or author name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 text-sm text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full bg-slate-50 text-sm text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All Authors</option>
              {authorsList.map((author, idx) => (
                <option key={idx} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2.5 rounded-xl transition ${
              viewMode === "table"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-500 hover:text-slate-800"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-xl transition ${
              viewMode === "grid"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-500 hover:text-slate-800"
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={fetchBooks}
            className="bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-rose-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content Rendering */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No books found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || selectedAuthor
              ? "No books matched your current search filters."
              : "Start building your collection by adding your first book."}
          </p>
          <Link
            to="/admin/books/add"
            className="inline-flex items-center gap-2 mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> Add Book
          </Link>
        </div>
      ) : viewMode === "table" ? (
        /* Table Layout */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Cover</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredBooks.map((book) => {
                  const bookId = book.id || book.book_id;
                  return (
                    <tr key={bookId} className="hover:bg-slate-50/70 transition group">
                      <td className="px-6 py-3.5">
                        <img
                          src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=120"}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded-lg shadow-xs group-hover:scale-105 transition"
                        />
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-slate-900">{book.title}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">ISBN: {book.isbn || "N/A"}</div>
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-600">
                        {book.authorName || book.author_name || "Unknown Author"}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-slate-900">
                        ₹{book.price}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          (book.stock || 0) > 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border border-rose-200/60"
                        }`}>
                          {book.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/books/edit/${bookId}`)}
                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                            title="Edit Book"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(bookId)}
                            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Delete Book"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards Layout */
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.map((book) => {
            const bookId = book.id || book.book_id;
            return (
              <div
                key={bookId}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-52 bg-slate-100 overflow-hidden relative">
                    <img
                      src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300"}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      ₹{book.price}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                      {book.authorName || book.author_name || "Unknown Author"}
                    </p>
                    <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {book.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100/80 mt-4 flex items-center justify-between">
                  <span className={`text-xs font-semibold ${
                    (book.stock || 0) > 0 ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {book.stock} in stock
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/books/edit/${bookId}`)}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bookId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
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
}

export default Books;