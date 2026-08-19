import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { FaStar, FaShoppingCart, FaArrowLeft, FaCheckCircle, FaBook, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchBookDetail();
    }
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/books/${id}`);
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!data) {
        setError("Book not found");
        return;
      }
      setBook(data);
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Failed to load book details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (book) {
      toast.success(`Added "${book.title}" to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 font-medium text-sm">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-5 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Book Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">{error || "The requested book could not be found."}</p>
        <Link to="/books" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
          <FaArrowLeft /> Back to Catalog
        </Link>
      </div>
    );
  }

  const authorName = book.authorName || book.author_name || "Popular Author";
  const image = book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-5">
        <Link to="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-600 mb-8 transition">
          <FaArrowLeft /> Back to Catalog
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 grid md:grid-cols-2 gap-12 items-start">
          {/* Cover Column */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-md max-h-[520px] flex items-center justify-center">
            <img src={image} alt={book.title} className="w-full h-full object-cover max-h-[520px]" />
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                <FaUser className="w-3 h-3" /> {authorName}
              </span>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mt-3">
                {book.title}
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-1">ISBN: {book.isbn || "978-0747532699"}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-green-700">₹{book.price}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                (book.stock || 0) > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}>
                {(book.stock || 0) > 0 ? `${book.stock} In Stock` : "Out of Stock"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              <span className="text-xs text-gray-500 font-medium ml-2">(4.9 rating / 120 customer reviews)</span>
            </div>

            <div className="border-t border-b border-gray-100 py-6">
              <h4 className="font-bold text-gray-800 text-sm mb-2">Book Synopsis</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {book.description || "A captivating literature piece featuring deep narrative depth, rich character development, and thought-provoking insights."}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FaCheckCircle className="text-green-600" /> Free delivery on eligible orders
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FaCheckCircle className="text-green-600" /> 100% Genuine and authentic print edition
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition"
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;