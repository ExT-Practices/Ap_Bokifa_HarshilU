import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuthors, deleteAuthor } from "../../services/authors";
import { UserCheck, Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { notifyDataChange } from "../../utils/sync";

const Authors = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAuthorsList = async () => {
    try {
      setLoading(true);
      const res = await getAuthors();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setAuthors(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load authors directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorsList();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this author?");
    if (!confirmDelete) return;

    try {
      await deleteAuthor(id);
      toast.success("Author deleted successfully!");
      notifyDataChange("AUTHORS");
      fetchAuthorsList();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete author.");
    }
  };

  const filteredAuthors = authors.filter((a) => {
    const name = (a.author_name || a.name || "").toLowerCase();
    const email = (a.email || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading authors directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" /> Author Profiles
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
            Authors Directory
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage author credentials, biographies, and contact emails.
          </p>
        </div>

        <Link
          to="/admin/authors/add"
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-emerald-500/20 transition active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" /> Add New Author
        </Link>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search author by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-sm text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-semibold">
          Showing {filteredAuthors.length} of {authors.length} authors
        </div>
      </div>

      {/* Authors List Grid */}
      {filteredAuthors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No authors found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search ? "No author matches your search query." : "Add author profiles to link with published books."}
          </p>
          <Link
            to="/admin/authors/add"
            className="inline-flex items-center gap-2 mt-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> Add Author
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAuthors.map((author) => {
            const authorId = author.author_id || author.id;
            const authorName = author.author_name || author.name;
            const avatarInitial = authorName ? authorName.charAt(0).toUpperCase() : "A";

            return (
              <div
                key={authorId}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-extrabold text-white text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                      {avatarInitial}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition">
                        {authorName}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">ID: #{authorId}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[64px]">
                    {author.bio || "No biography details available for this author."}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    {author.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{author.email}</span>
                      </div>
                    )}
                    {author.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{author.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate(`/admin/authors/edit/${authorId}`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-xs font-semibold transition"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(authorId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Author"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Authors;