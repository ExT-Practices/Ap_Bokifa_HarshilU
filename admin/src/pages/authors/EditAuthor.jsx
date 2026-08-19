import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getAuthorById, updateAuthor } from "../../services/authors";
import { UserCheck, ArrowLeft, User, Mail, Phone, Save } from "lucide-react";
import toast from "react-hot-toast";
import { notifyDataChange } from "../../utils/sync";

const EditAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      setLoading(true);
      const res = await getAuthorById(id);
      const data = Array.isArray(res.data) ? res.data[0] : (res.data?.data || res.data);

      if (!data) {
        toast.error("Author not found.");
        navigate("/admin/authors");
        return;
      }

      setAuthor({
        name: data.author_name || data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load author profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAuthor({
      ...author,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!author.name.trim()) {
      toast.error("Author name is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        author_name: author.name.trim(),
        name: author.name.trim(),
        email: author.email.trim(),
        phone: author.phone.trim(),
        bio: author.bio.trim(),
      };

      await updateAuthor(id, payload);
      toast.success("Author updated successfully!");
      notifyDataChange("AUTHORS");
      navigate("/admin/authors");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update author.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading author profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/authors"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Authors Directory
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Edit Author Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5">Update author contact details and biography</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Author Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                value={author.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 text-sm text-slate-800 pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={author.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-sm text-slate-800 pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="phone"
                  value={author.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-sm text-slate-800 pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Biography */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Author Biography / Overview
            </label>
            <textarea
              name="bio"
              value={author.bio}
              onChange={handleChange}
              rows="5"
              className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/authors")}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAuthor;