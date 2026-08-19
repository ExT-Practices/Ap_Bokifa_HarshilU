const CategoryCard = ({ item }) => {
  return (
    <div className="group rounded-3xl overflow-hidden shadow hover:shadow-xl duration-300 bg-white">

      <div className="overflow-hidden">

        <img
          src={item.image}
          alt={item.title}
          className="w-full h-72 object-cover group-hover:scale-110 duration-500"
        />

      </div>

      <div className="py-6 text-center">

        <h2 className="text-2xl font-semibold">
          {item.title}
        </h2>

        <p className="text-gray-500 mt-2">
          {item.books}
        </p>

      </div>

    </div>
  );
};

export default CategoryCard;