import React from "react";

const Profile = () => {
  return (
    <div
      className={`md:ml-52 mt-[60px] md:mt-[130px] h-[100vh] px-4 md:px-6 bg-white text-black min-h-screen flex flex-col`}
    >
      <div className="flex flex-col gap-4 justify-between items-center mb-8">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <h3 className="text-2xl font-medium mb-4">User Information</h3>
          <div className="border p-4 rounded-lg">
            <p>
              <strong>Name:</strong> John Doe
            </p>
            <p>
              <strong>Email:</strong> john@example.com
            </p>
            <p>
              <strong>Occupation:</strong> Software Engineer
            </p>
            <p>
              <strong>Status:</strong> Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
