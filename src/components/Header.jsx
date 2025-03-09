import React, { useState } from "react";
import Navigation from "./Navigation";
import logo from "./../assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 md:left-52 right-0 shadow-md z-50 h-[60px] md:h-[100px] bg-white">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-start h-full">
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
