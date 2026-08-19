import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Search, Bell, ExternalLink, ShieldCheck, ChevronRight } from "lucide-react";

function Topbar() {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Dashboard Overview";
    if (path.includes("/admin/books/add")) return "Add New Book";
    if (path.includes("/admin/books/edit")) return "Edit Book";
    if (path.includes("/admin/books")) return "Books Catalog";
    if (path.includes("/admin/authors/add")) return "Add New Author";
    if (path.includes("/admin/authors/edit")) return "Edit Author";
    if (path.includes("/admin/authors")) return "Authors Directory";
    if (path.includes("/admin/blogs/add")) return "Publish New Article";
    if (path.includes("/admin/blogs/edit")) return "Edit Article";
    if (path.includes("/admin/blogs")) return "Blog Posts";
    return "Admin Console";
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10 px-8 flex items-center justify-between shadow-xs">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>Bookify Studio</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-indigo-600 font-semibold">{getPageTitle()}</span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center w-96 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
        <input
          type="text"
          placeholder="Search books, authors, articles..."
          className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Client Storefront Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition"
        >
          <span>View Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Server Sync Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>API Connected</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Admin Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;