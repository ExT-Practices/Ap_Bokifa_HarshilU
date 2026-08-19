// import { Link } from "react-router-dom";
// import { FaSearch, FaRegHeart, FaRegUser, FaShoppingBag, FaShieldAlt } from "react-icons/fa";

// const Navbar = () => {
//   return (
//     <>
//       <div className="border-b border-zinc-200 bg-white sticky top-0 z-30 shadow-xs">
//         <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-2">
//             <span className="text-3xl font-serif font-black tracking-tight text-gray-900">
//               Book<span className="text-green-600">ify</span>
//             </span>
//           </Link>

//           <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-700">
//             <Link to="/" className="hover:text-green-600 transition">
//               Home
//             </Link>
//             <Link to="/books" className="hover:text-green-600 transition">
//               Books Catalog
//             </Link>
//             <Link to="/blogs" className="hover:text-green-600 transition">
//               Articles & Blog
//             </Link>
//           </div>

//           <div className="flex items-center gap-4">
//             <a
//               href="http://localhost:5174/admin/dashboard"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-900 hover:text-white transition shadow-xs"
//             >
//               <FaShieldAlt className="text-indigo-500" />
//               <span>Admin Studio</span>
//             </a>

//             <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
//               <FaRegHeart className="text-xl text-gray-700" />
//               <span className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full flex justify-center items-center text-[10px] font-bold">
//                 0
//               </span>
//             </div>

//             <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
//               <FaShoppingBag className="text-xl text-gray-700" />
//               <span className="absolute top-0 right-0 bg-green-600 text-white w-4 h-4 rounded-full flex justify-center items-center text-[10px] font-bold">
//                 0
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;

import { FaSearch, FaRegHeart, FaRegUser, FaShoppingBag, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto h-24 flex items-center justify-between">
          <Link to="/"><img src="https://ap-bokifa.myshopify.com/cdn/shop/files/logo.png?v=1729482566" alt="" className="w-44"/></Link>
          <div className="hidden lg:flex w-[550px]">
            <input type="text" placeholder='Search our store...' className=' w-200 h-12 text-sm  tracking-wide  bg-gray-100 rounded-full p-3'/>
            <button type="submit" className='bg-green-700 -translate-x-15 cursor-pointer gap-3 flex items-center py-3 px-5 font-semibold text-white p-2 rounded-full ml-2'><FaSearch />Search</button>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2">USD<FaChevronDown /></div>
            <div className="hidden md:flex items-center gap-2">English<FaChevronDown /></div>
            <FaRegUser className="text-2xl cursor-pointer"/>
            <div className="relative">
              <FaRegHeart className="text-2xl cursor-pointer"/>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex justify-center items-center text-xs">0</span>
            </div>
            <div className="relative">
              <FaShoppingBag className="text-2xl cursor-pointer"/>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex justify-center items-center text-xs">0</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <ul className="flex gap-10 font-medium">
            <li className="text-green-700 cursor-pointer flex items-center gap-2">Home<FaChevronDown /></li>
            <li className="cursor-pointer flex items-center gap-2">Shop <FaChevronDown /></li>
            <li className="cursor-pointer flex items-center gap-2">Blogs <FaChevronDown /></li>
            <li className="cursor-pointer flex items-center gap-2">Pages <FaChevronDown /></li>
            <li className="cursor-pointer flex items-center gap-2">Contact <FaChevronDown /> </li>
          </ul>
          <h3 className="font-semibold">Need help? Call Us:<span className="text-black ml-2">+84 2500 888 33</span>
          </h3>
        </div>
      </div>
    </>
  );
};

export default Navbar;  
