import {
  FaHeart,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

const NewArrivalCard = ({ book }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl duration-300">

      <div className="relative overflow-hidden">

        <img
          src={book.image}
          alt={book.title}
          className="w-full h-80 object-cover group-hover:scale-110 duration-500"
        />

        <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
          NEW
        </span>

        <span className="absolute top-14 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
          {book.discount}
        </span>

        <button className="absolute top-4 right-4 bg-white p-3 rounded-full shadow opacity-0 group-hover:opacity-100 duration-300">
          <FaHeart />
        </button>

        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 duration-300">
          <FaShoppingCart />
          Add To Cart
        </button>

      </div>

      <div className="p-5">

        <p className="text-sm text-gray-500">
          {book.author}
        </p>

        <h3 className="text-xl font-semibold mt-2">
          {book.title}
        </h3>

        <div className="flex gap-1 text-yellow-400 mt-3">
          {Array(book.rating)
            .fill()
            .map((_, i) => (
              <FaStar key={i} />
            ))}
        </div>

        <div className="flex items-center gap-3 mt-4">

          <span className="text-green-600 text-2xl font-bold">
            ${book.price}
          </span>

          <span className="line-through text-gray-400">
            ${book.oldPrice}
          </span>

        </div>

      </div>

    </div>
  );
};

export default NewArrivalCard;