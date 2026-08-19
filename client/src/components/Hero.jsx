import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { FaArrowRight } from "react-icons/fa6";
// import { heroSlides } from "./heroData";

const Hero = () => {
    return (
        <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
            }}
            loop
        >
                <SwiperSlide>
                    <section className="relative h-[700px] overflow-hidden">
                        <img src="https://ap-bokifa.myshopify.com/cdn/shop/files/bo_h1_slide.jpg?v=1728533089&width=3000" alt="" className="absolute inset-0 h-full w-full object-cover"/>
                        <div className="relative z-10 h-full max-w-7xl mx-auto px-10 flex items-center">
                            <div className="max-w-xl">
                                <p className="text-[#5d8790] text-2xl mb-3">A brand new series.</p>
                                <h1 className="text-5xl font-serif font-bold leading-tight whitespace-pre-line">THE WORLD OF YOUNG ADULT BOOKS</h1>
                                <p className="text-sm text-gray-700 mt-2 mb-5">Save up to 15% on new releases.</p>
                                <button className="bg-white rounded-full px-5 py-3 text-sm flex items-center gap-2 font-semibold shadow-md hover:bg-black hover:text-white duration-300">Discover Now<FaArrowRight /></button>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>
                <SwiperSlide>
                    <section className="relative h-[700px] overflow-hidden">
                        <img src="https://ap-bokifa.myshopify.com/cdn/shop/files/ap_bo_slide_1.jpg?v=1729482289&width=3000" alt="" className="absolute inset-0 h-full w-full object-cover"/>
                        <div className="relative translate-x-195 z-10 h-full max-w-7xl mx-auto px-10 flex items-center">
                            <div className="max-w-xl">
                                <p className="text-[#5d8790] text-2xl mb-3">In-store and online.</p>
                                <h1 className="text-5xl font-serif font-bold leading-tight whitespace-pre-line">MORE HORROR NOVELS FROM<br/> STAR AUTHORS</h1>
                                <p className="text-sm text-gray-700 mt-2 mb-5">Stay up-to-date with the most exciting new books.</p>
                                <button className="bg-white rounded-full px-5 py-3 text-sm flex items-center gap-2 font-semibold shadow-md hover:bg-black hover:text-white duration-300">Discover Now<FaArrowRight /></button>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>
                <SwiperSlide>
                    <section className="relative h-[700px] overflow-hidden">
                        <img src="https://ap-bokifa.myshopify.com/cdn/shop/files/ap_bo_slide_2.jpg?v=1729482289&width=3000" alt="" className="absolute inset-0 h-full w-full object-cover"/>
                        <div className="relative z-10 h-full text-center justify-center max-w-7xl mx-auto px-10 flex items-center">
                            <div className="max-w-xl">
                                <p className="text-[#5d8790] text-2xl mb-3">Fiction addiction.</p>
                                <h1 className="text-5xl font-serif font-bold leading-tight whitespace-pre-line">YOUR ULTIMATE PAGE-TO-SCREEN READING LIST</h1>
                                <p className="text-sm text-gray-700 mt-2 mb-5">Save over $24 with the Booker prize shortlist collection.</p>
                                <button className="bg-white rounded-full px-5 py-3 text-sm flex translate-x-[140%] items-center  gap-2 font-semibold shadow-md hover:bg-black hover:text-white duration-300">Discover Now<FaArrowRight /></button>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>
        </Swiper>
    );
};

export default Hero;