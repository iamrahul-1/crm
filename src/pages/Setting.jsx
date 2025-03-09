import React from "react";

const Setting = () => {
  return (
    <div className="md:ml-52 mt-[60px] md:mt-[120px] flex flex-col h-full md:px-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Settings</h3>
      <div className="p-4 rounded-lg shadow-md w-full mx-auto bg-gray-100">
        <div className="bg-white shadow-md text-lg rounded-lg p-6">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-800">
              Notification Preferences
            </label>
            <select className="border rounded-lg p-2 w-full bg-white text-gray-800">
              <option>Email Notifications</option>
              <option>SMS Notifications</option>
              <option>No Notifications</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-800">
              Privacy Settings
            </label>
            <select className="border rounded-lg p-2 w-full bg-white text-gray-800">
              <option>Public</option>
              <option>Friends Only</option>
              <option>Private</option>
            </select>
          </div>
          <button className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white shadow-md">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
