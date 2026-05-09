import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
    <h1 className="text-8xl font-bold mb-4">404</h1>
    <p className="text-2xl mb-8 text-gray-400">Page not found.</p>
    <Link
      to="/"
      className="px-6 py-3 bg-[#22e000] text-black rounded-lg font-semibold hover:bg-green-400 transition"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFound;
