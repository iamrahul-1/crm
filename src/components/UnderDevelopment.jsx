import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const UnderDevelopment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:pl-56">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
        <h1 className="ml-3 text-xl font-semibold text-gray-800">Under Development</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="text-7xl">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Work in Progress
            </h2>
            <p className="text-gray-600 text-center max-w-md text-lg">
              We're working hard to bring you this feature. Please check back later!
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-8 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
