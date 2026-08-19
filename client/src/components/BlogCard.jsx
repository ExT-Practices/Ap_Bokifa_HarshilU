import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt, FaUser } from "react-icons/fa";

const BlogCard = ({ blog }) => {
  const blogId = blog.id || blog.blog_id;
  const image = blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400";
  const author = blog.author || blog.authorName || "Editorial Team";
  const date = blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "Recent Post";

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl duration-300 border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="overflow-hidden h-60 bg-gray-100">
          <img
            src={image}
            alt={blog.title}
            className="h-full w-full object-cover group-hover:scale-105 duration-500"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1.5 text-purple-600 font-semibold">
              <FaUser className="w-3 h-3" /> {author}
            </span>
            <span className="flex items-center gap-1">
              <FaCalendarAlt /> {date}
            </span>
          </div>

          <Link to={`/blog/${blogId}`}>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition line-clamp-2">
              {blog.title}
            </h3>
          </Link>

          <p className="text-gray-500 text-xs mt-3 line-clamp-3 leading-relaxed">
            {blog.description || blog.content || "Click to read full article story."}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-0">
        <Link
          to={`/blog/${blogId}`}
          className="inline-flex items-center gap-2 text-purple-600 font-bold text-sm hover:gap-3 duration-300"
        >
          <span>Read Full Article</span>
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;