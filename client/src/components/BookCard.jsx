import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";

const BookCard = ({ book }) => {
  const bookId = book.id || book.book_id;
  const authorName = book.authorName || book.author_name || book.author || "Popular Author";
  const image = book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400";
  const price = book.price ? `₹${book.price}` : "₹399";
  const rating = book.rating || 5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    toast.success(`Added "${book.title}" to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toast.success(`Saved "${book.title}" to wishlist!`);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl duration-300 border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="relative overflow-hidden bg-gray-100 h-80">
          <img
            src={image}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 duration-500"
          />

          {book.discount && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {book.discount}
            </span>
          )}

          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-md text-gray-600 hover:bg-green-600 hover:text-white transition"
          >
            <FaHeart />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 duration-300">
            <Link
              to={`/book/${bookId}`}
              className="bg-white p-3 rounded-full shadow-md text-gray-700 hover:bg-green-600 hover:text-white transition"
              title="View Book Details"
            >
              <FaEye />
            </Link>

            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700 transition"
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>

        <div className="p-5">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-wider">
            {authorName}
          </p>

          <Link to={`/book/${bookId}`}>
            <h3 className="font-bold text-gray-900 text-lg mt-1 line-clamp-1 hover:text-green-600 transition">
              {book.title}
            </h3>
          </Link>

          <div className="flex mt-2 text-yellow-400 text-xs">
            {Array(rating)
              .fill(0)
              .map((_, i) => (
                <FaStar key={i} />
              ))}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-green-700 text-xl font-extrabold">
              {price}
            </span>
            {book.oldPrice && (
              <span className="line-through text-gray-400 text-sm">
                ${book.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;