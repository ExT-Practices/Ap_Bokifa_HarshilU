import { categories } from "../data/categories";
import CategoryCard from "./CategoryCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const Categories = () => {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-5">

        <div className="text-center mb-16">

          <p className="text-green-600 text-lg">
            Shop by Category
          </p>

          <h2 className="text-5xl font-serif font-bold mt-3">
            Featured Categories
          </h2>

        </div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000,
          }}
          loop={true}
          spaceBetween={30}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 5,
            },
          }}
        >
          {categories.map((item) => (
            <SwiperSlide key={item.id}>
              <CategoryCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Categories;