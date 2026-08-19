import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import NewArrival from "../components/NewArrival";
import FeaturedAuthors from "../components/FeaturedAuthors";
import LatestBlogs from "../components/LatestBlogs";

const Home = () => {
  return (
    <>
      <Hero />
      {/* <Categories /> */}
      {/* <BestSeller /> */}
      <NewArrival />
      <FeaturedAuthors />
      <LatestBlogs />

    </>
  );
};

export default Home;