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