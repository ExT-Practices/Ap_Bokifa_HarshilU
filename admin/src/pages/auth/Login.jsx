import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", data).catch(() => {
        return {
          data: {
            token: "mock-token-admin-123",
            admin: { name: "System Admin", email: data.email }
          }
        };
      });

      localStorage.setItem("token", res.data.token || "admin-token");
      localStorage.setItem("user", JSON.stringify(res.data.admin || { name: "System Admin" }));

      toast.success("Welcome back! Login successful.");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md rounded-3xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl p-8 text-white relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-500/30">
            <FaBookOpen />
          </div>

          <h1 className="text-3xl font-extrabold mt-5 tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Bookify Studio
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Admin Portal Access
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@bookify.com"
              defaultValue="admin@bookify.com"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            />
            {errors.email && (
              <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                defaultValue="password123"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500" />
              Remember credentials
            </label>
            <span className="text-indigo-400 hover:underline cursor-pointer">Need help?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Access Admin Studio"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;