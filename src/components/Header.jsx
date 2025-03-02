import React, { useState } from "react";
import Navigation from "./Navigation";
import logo from "./../assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 md:left-52 right-0 shadow-md z-50 h-[60px] md:h-[100px] bg-white">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-start h-full">
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-black"
            aria-label="Toggle Navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          <h1 className="flex items-center gap-4 text-2xl md:text-4xl mx-auto font-bold text-gray-800">
            <img className="h-11 md:h-20 w-auto" src={logo} alt="Logo" />
            SHATRANJ CRM
          </h1>
        </div>
      </div>

      <Navigation isOpen={isOpen} toggleMenu={toggleMenu} />
    </header>
  );
};

export default Header;
