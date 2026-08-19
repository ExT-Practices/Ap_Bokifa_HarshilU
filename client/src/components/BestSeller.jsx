import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "./BookCard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { subscribeToDataChanges } from "../utils/sync";

const BestSeller = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
    const unsubscribe = subscribeToDataChanges(fetchBestSellers, 3000);
    return () => unsubscribe();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      const data = Array.isArray(res.data) ? res.data : [];
      setBooks(data);
    } catch (err) {
      console.error("Failed to load bestseller books:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center mb-14">
          <div>
            <p className="text-green-600 font-bold text-sm tracking-wider uppercase">
              Best Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-gray-900">
              Best Selling Books
            </h2>
          </div>

          <Link
            to="/books"
            className="hidden sm:inline-flex border-2 border-green-600 text-green-600 font-bold px-7 py-3 rounded-full hover:bg-green-600 hover:text-white duration-300 text-sm"
          >
            View Full Catalog
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 font-medium">Loading store bestsellers...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            No bestseller books currently listed.
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={books.length > 3}
            spaceBetween={25}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {books.map((book) => (
              <SwiperSlide key={book.id || book.book_id}>
                <BookCard book={book} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default BestSeller;