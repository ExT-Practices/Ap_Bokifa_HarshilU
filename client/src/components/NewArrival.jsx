import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "./BookCard";
import { Link } from "react-router-dom";

import { subscribeToDataChanges } from "../utils/sync";

const NewArrival = () => {
  const [newBooks, setNewBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
    const unsubscribe = subscribeToDataChanges(fetchNewArrivals, 3000);
    return () => unsubscribe();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      const data = Array.isArray(res.data) ? res.data : [];
      setNewBooks(data.slice(0, 4));
    } catch (err) {
      console.error("Failed to load new arrival books:", err);
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
              Latest Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-gray-900">
              New Arrival Books
            </h2>
          </div>

          <Link
            to="/books"
            className="border-2 border-green-600 text-green-600 font-bold px-8 py-3 rounded-full hover:bg-green-600 hover:text-white duration-300 text-sm"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 font-medium">Loading new arrivals...</p>
          </div>
        ) : newBooks.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
            No new arrival books listed yet.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {newBooks.map((book) => (
              <BookCard key={book.id || book.book_id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrival;