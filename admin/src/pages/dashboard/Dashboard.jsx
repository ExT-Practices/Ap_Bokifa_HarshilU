import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  BookOpen,
  Users,
  FileText,
  FolderTree,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Eye
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    books: 0,
    authors: 0,
    blogs: 0,
    categories: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [booksRes, authorsRes, blogsRes] = await Promise.all([
        api.get("/books").catch(() => ({ data: [] })),
        api.get("/authors").catch(() => ({ data: [] })),
        api.get("/blogs").catch(() => ({ data: [] }))
      ]);

      const booksList = Array.isArray(booksRes.data) ? booksRes.data : [];
      const authorsList = Array.isArray(authorsRes.data) ? authorsRes.data : [];
      const blogsList = Array.isArray(blogsRes.data) ? blogsRes.data : [];

      setStats({
        books: booksList.length,
        authors: authorsList.length,
        blogs: blogsList.length,
        categories: 4,
      });

      setRecentBooks(booksList.slice(0, 5));
      setRecentBlogs(blogsList.slice(0, 4));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Books",
      value: stats.books,
      subtext: "Live catalog titles",
      gradient: "from-blue-600 to-indigo-600",
      icon: BookOpen,
      link: "/admin/books",
      addLink: "/admin/books/add"
    },
    {
      title: "Featured Authors",
      value: stats.authors,
      subtext: "Verified writers",
      gradient: "from-emerald-500 to-teal-600",
      icon: Users,
      link: "/admin/authors",
      addLink: "/admin/authors/add"
    },
    {
      title: "Blog Articles",
      value: stats.blogs,
      subtext: "Published stories",
      gradient: "from-purple-600 to-pink-600",
      icon: FileText,
      link: "/admin/blogs",
      addLink: "/admin/blogs/add"
    },
    {
      title: "Categories",
      value: stats.categories,
      subtext: "Active genres",
      gradient: "from-amber-500 to-orange-600",
      icon: FolderTree,
      link: "/admin/books",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Bookify Management Suite
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, Admin 👋
            </h1>
            <p className="text-slate-400 mt-2 text-sm max-w-xl">
              Control your online book store, manage author profiles, publish blogs, and view real-time catalog metrics seamlessly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/books/add"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-semibold text-sm shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Book
            </Link>
            <Link
              to="/admin/authors/add"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-sm border border-slate-700 transition active:scale-95 text-slate-200"
            >
              <Plus className="w-4 h-4" /> Add Author
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md border border-slate-100/80 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                    {loading ? "..." : card.value}
                  </h2>
                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> {card.subtext}
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={card.link}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                >
                  Manage All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                {card.addLink && (
                  <Link
                    to={card.addLink}
                    className="text-xs font-medium text-slate-400 hover:text-slate-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> New
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;