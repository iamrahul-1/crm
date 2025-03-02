import React from "react";

const Setting = () => {
  return (
    <div
      className={`md:ml-52 mt-[60px] md:mt-[130px] px-4 md:px-6 bg-white text-black min-h-screen flex justify-center`}
    >
      <div className="w-full md:w-1/2">
        <h3 className="text-2xl font-medium mb-4">Settings</h3>
        <div className="border p-4 rounded-lg">
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Notification Preferences
            </label>
            <select
              className={`border rounded-lg p-2 w-full bg-white text-black`}
            >
              <option>Email Notifications</option>
              <option>SMS Notifications</option>
              <option>No Notifications</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Privacy Settings</label>
            <select
              className={`border rounded-lg p-2 w-full bg-white text-black`}
            >
              <option>Public</option>
              <option>Friends Only</option>
              <option>Private</option>
            </select>
          </div>
          <button
            className={`mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white`}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
