import React from "react";

const Profile = () => {
  return (
    <div className="md:ml-52 mt-[60px] md:mt-[120px] flex flex-col h-full md:px-8 ">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        User Information
      </h3>
      <div className="p-4 rounded-lg shadow-md w-full mx-auto bg-gray-100">
        <div className="bg-white shadow-md text-lg rounded-lg p-6">
          <p className="text-gray-800 pb-6">
            <strong>Name:</strong> John Doe
          </p>
          <p className="text-gray-800 pb-6">
            <strong>Email:</strong> john@example.com
          </p>
          <p className="text-gray-800 pb-6">
            <strong>Occupation:</strong> Software Engineer
          </p>
          <p className="text-gray-800 pb-6">
            <strong>Status:</strong> Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
