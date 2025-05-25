import React from "react";
import { Link } from "react-router-dom";
import NotFoundSvg from "/not-found.svg";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <img
        src={NotFoundSvg}
        alt="Page Not Found"
        className="w-full max-w-md mb-8"
      />
      <h1 className="text-xl font-bold leading-tight tracking-tight text-[#03C9D7] md:text-2xl text-center">
        Ohh! Page not found
        <p className="text-sm font-normal text-gray-500 mt-1">
          We can't seem to find the page you are looking for.
        </p>
      </h1>
      <Link
        to="/"
        className="mt-4 text-[#03C9D7] hover:text-blue-800 no-underline focus:outline-none transition duration-300"
      >
        Back Home
      </Link>
    </div>
  );
};

export default NotFound;
