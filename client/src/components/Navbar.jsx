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
            </div>
            <div className="relative">
              <FaShoppingBag className="text-2xl cursor-pointer"/>
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
