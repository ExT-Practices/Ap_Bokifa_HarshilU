import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 mt-20">
      <div className="max-w-7xl mx-auto py-20 grid max-[1024px]:grid-cols-2 max-[1024px]:max-w-2xl max-[768px]:grid-cols-1 max-[768px]:ml-3  lg:grid-cols-5 gap-12">
        <div>
          <img src="https://ap-bokifa.myshopify.com/cdn/shop/files/logo.png?v=1729482566" className="w-44 mb-6" alt=""/>
          <p className="text-gray-600 leading-8">Bokifa draws book lovers of all ages into a community, engage with booklovers and meet their favourite literary personalities.          </p>
          <h2 className="text-2xl text-yellow-600 mt-6">+(84)-1800-4635</h2>
          <p className="mt-4">contact@example.com</p>
        </div>
        <div>
          <h2 className="text-2xl mb-6">Category</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="hover:text-green-700 cursor-pointer">Action Books</li>
            <li className="hover:text-green-700 cursor-pointer">Comedy</li>
            <li className="hover:text-green-700 cursor-pointer">Drama</li>
            <li className="hover:text-green-700 cursor-pointer">Horror</li>
            <li className="hover:text-green-700 cursor-pointer">Kids Books</li>
            <li className="hover:text-green-700 cursor-pointer">Top 50 Books</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl mb-6">Useful Links</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="hover:text-green-700 cursor-pointer">Secure Shopping</li>
            <li className="hover:text-green-700 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-green-700 cursor-pointer">Terms of Use</li>
            <li className="hover:text-green-700 cursor-pointer">Shipping Policy</li>
            <li className="hover:text-green-700 cursor-pointer">Returns Policy</li>
            <li className="hover:text-green-700 cursor-pointer">Payment Option</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl mb-6">Explore</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="hover:text-green-700 cursor-pointer">About us</li>
            <li className="hover:text-green-700 cursor-pointer">Store Locator</li>
            <li className="hover:text-green-700 cursor-pointer">Kids Club</li>
            <li className="hover:text-green-700 cursor-pointer">Blogs</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl mb-6">Get in touch</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="hover:text-green-700 cursor-pointer">Careers</li>
            <li className="hover:text-green-700 cursor-pointer">Become a Franchisee</li>
            <li className="hover:text-green-700 cursor-pointer">Contact Us</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 ">
        <div className="max-w-7xl mx-auto py-6 flex max-[768px]:flex-col max-[768px]:gap-3 justify-between items-center">
          <p className="text-gray-500 max-[375px]:text-sm"> Copyright © 2025 Bokifa. All Rights Reserved.</p>
          <div className="flex gap-3">
            <img src="https://ap-bokifa.myshopify.com/cdn/shop/files/pay.png?v=1729758744&width=1000" className="h-8 max-[425px]:h-7 max-[375px]:h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;