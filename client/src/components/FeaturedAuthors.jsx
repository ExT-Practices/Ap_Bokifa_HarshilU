import { useEffect, useState } from "react";
import api from "../services/api";
import AuthorCard from "./AuthorCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { subscribeToDataChanges } from "../utils/sync";

const FeaturedAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthorsList();
    const unsubscribe = subscribeToDataChanges(fetchAuthorsList, 3000);
    return () => unsubscribe();
  }, []);

  const fetchAuthorsList = async () => {
    try {
      setLoading(true);
      const res = await api.get("/authors");
      const data = Array.isArray(res.data) ? res.data : [];
      setAuthors(data);
    } catch (err) {
      console.error("Failed to load featured authors:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24  bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-20">
          <p className="text-green-600 font-bold text-sm tracking-wider uppercase">
            Meet Our Writers
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-gray-900">
            Featured Authors
          </h2>
          <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">
            Explore books written by popular novelists, scholars, and bestselling authors.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 font-medium">Loading author profiles...</p>
          </div>
        ) : authors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            No featured authors found.
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={authors.length > 3}
            spaceBetween={30}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {authors.map((author) => (
              <SwiperSlide key={author.id || author.author_id} className="mb-10">
                <AuthorCard author={author} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default FeaturedAuthors;