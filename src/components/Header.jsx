import React, { useState } from "react";
import Navigation from "./Navigation";
import logo from "./../assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 md:left-52 right-0 shadow-md z-50 h-[60px] md:h-[100px] bg-white">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Hamburger Menu Button (visible only on mobile) */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-gray-800 transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-gray-800 transition-opacity ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-gray-800 transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>

          <h1 className="flex items-center gap-4 text-2xl md:text-4xl mx-auto font-bold text-gray-800">
            <img className="h-11 md:h-20 w-auto" src={logo} alt="Logo" />
          </h1>
        </div>
      </div>
      <Navigation isOpen={isOpen} toggleMenu={() => setIsOpen(!isOpen)} />
    </header>
  );
};

export default Header;
