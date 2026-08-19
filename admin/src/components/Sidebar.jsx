import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  FileText,
  PlusCircle,
  LogOut,
  Sparkles,
  BookMarked
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      badge: "Live"
    },
    {
      title: "Books Management",
      path: "/admin/books",
      icon: BookOpen,
      actionPath: "/admin/books/add",
      actionText: "Add Book"
    },
    {
      title: "Authors Directory",
      path: "/admin/authors",
      icon: UserCheck,
      actionPath: "/admin/authors/add",
      actionText: "Add Author"
    },
    {
      title: "Blogs & Articles",
      path: "/admin/blogs",
      icon: FileText,
      actionPath: "/admin/blogs/add",
      actionText: "Add Blog"
    }
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between p-5 border-r border-slate-800 shadow-2xl relative z-20">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BookMarked className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Bookify
            </h1>
            <span className="text-xs text-indigo-400 font-medium tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Admin Studio
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <div key={item.path} className="group relative">
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Quick Actions
          </p>
          <div className="space-y-2">
            <Link
              to="/admin/books/add"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/40 hover:bg-indigo-600/20 hover:text-indigo-300 border border-slate-700/40 transition"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Publish New Book</span>
            </Link>
            <Link
              to="/admin/authors/add"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/40 hover:bg-emerald-600/20 hover:text-emerald-300 border border-slate-700/40 transition"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Add Author Profile</span>
            </Link>
            <Link
              to="/admin/blogs/add"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/40 hover:bg-purple-600/20 hover:text-purple-300 border border-slate-700/40 transition"
            >
              <PlusCircle className="w-4 h-4 text-purple-400" />
              <span>Write Blog Article</span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center font-bold text-white text-sm shadow">
              A
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">System Admin</p>
              <p className="text-[11px] text-slate-400">admin@bookify.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;