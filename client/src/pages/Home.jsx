import Hero from "../components/Hero";
import NewArrival from "../components/NewArrival";
import FeaturedAuthors from "../components/FeaturedAuthors";
import LatestBlogs from "../components/LatestBlogs";

const Home = () => {
  return (
    <>
      <Hero />
      <NewArrival />
      <FeaturedAuthors />
      <LatestBlogs />

    </>
  );
};

export default Home;