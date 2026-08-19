import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { FiSearch, FiBook, FiFilter } from "react-icons/fi";
import { subscribeToDataChanges } from "../utils/sync";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchBooks();
    const unsubscribe = subscribeToDataChanges(fetchBooks, 3000);
    return () => unsubscribe();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      const data = Array.isArray(res.data) ? res.data : [];
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const authorsList = Array.from(new Set(books.map((b) => b.authorName || b.author_name).filter(Boolean)));

  const filteredBooks = books
    .filter((b) => {
      const titleMatch = b.title?.toLowerCase().includes(search.toLowerCase());
      const authorMatch = (b.authorName || b.author_name || "").toLowerCase().includes(search.toLowerCase());
      const authorFilterMatch = selectedAuthor
        ? (b.authorName === selectedAuthor || b.author_name === selectedAuthor)
        : true;
      return (titleMatch || authorMatch) && authorFilterMatch;
    })
    .sort((a, b) => {
      if (sortBy === "low-high") return Number(a.price) - Number(b.price);
      if (sortBy === "high-low") return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-10 mb-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
              Live Bookstore Catalog
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mt-4">
              Explore Our Collection
            </h1>
            <p className="text-slate-300 text-sm mt-3">
              Discover timeless classics, bestsellers, non-fiction guides, and technical literature carefully curated for passionate readers.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by book title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-green-600 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-xl px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="">All Authors</option>
              {authorsList.map((author, idx) => (
                <option key={idx} value={author}>
                  {author}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-xl px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="default">Sort by Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 font-medium text-sm">Loading books from store server...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xs">
            <FiBook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800">No books found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id || book.book_id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Books;