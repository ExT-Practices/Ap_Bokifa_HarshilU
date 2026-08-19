import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addAuthor } from "../../services/authors";
import { UserCheck, ArrowLeft, User, Mail, Phone, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { notifyDataChange } from "../../utils/sync";

const AddAuthor = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [author, setAuthor] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

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
      setSubmitting(true);
      const payload = {
        author_name: author.name.trim(),
        name: author.name.trim(),
        email: author.email.trim(),
        phone: author.phone.trim(),
        bio: author.bio.trim(),
      };

      await addAuthor(payload);
      toast.success("Author added successfully!");
      notifyDataChange("AUTHORS");
      navigate("/admin/authors");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add author.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-extrabold text-slate-900">Add New Author Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5">Register a writer to associate with books</p>
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
                placeholder="e.g. J.K. Rowling"
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
                  placeholder="author@example.com"
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
                  placeholder="+1 555-0199"
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
              placeholder="Write a brief overview of the author's work, awards, background..."
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
              disabled={submitting}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/25 transition disabled:opacity-50"
            >
              {submitting ? "Saving Author..." : "Save Author Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAuthor;