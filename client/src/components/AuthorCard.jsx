import { Link } from "react-router-dom";

const AuthorCard = ({ author }) => {
  const authorName = author.author_name || author.name || "Featured Author";
  const avatarInitial = authorName ? authorName.charAt(0).toUpperCase() : "A";

  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 p-8 text-center flex flex-col justify-between h-full">
      <div>
        {author.image ? (
          <img
            src={author.image}
            alt={authorName}
            className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-green-500 group-hover:scale-105 duration-300 shadow-md"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-green-600 to-teal-600 flex items-center justify-center font-extrabold text-white text-3xl mx-auto border-4 border-green-200 shadow-md group-hover:scale-105 duration-300">
            {avatarInitial}
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mt-5 group-hover:text-green-600 transition">
          {authorName}
        </h3>

        <p className="text-xs text-gray-500 mt-2 line-clamp-2 px-2">
          {author.bio || "Bestselling author registered in Bookify store."}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50">
        <Link
          to="/books"
          className="inline-block w-full py-2.5 rounded-full bg-green-50 text-green-700 font-bold text-xs hover:bg-green-600 hover:text-white transition"
        >
          View Books
        </Link>
      </div>
    </div>
  );
};

export default AuthorCard;