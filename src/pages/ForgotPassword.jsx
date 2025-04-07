import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./../assets/logo.png";
import api from "../services/api";
import { toast } from "react-toastify";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Verification code has been sent to your email!");
    } catch (err) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-grid-white/[0.2] bg-grid-16 [mask-image:linear-gradient(0deg,transparent,black)]" />
        </div>
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="max-w-md text-white space-y-8">
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg shadow-xl">
              <h1 className="text-4xl font-bold mb-4">Reset Your Password</h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                Don't worry! It happens. Please enter the email address associated with
                your account, and we'll send you a verification code to reset your password.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2">Secure Process</h3>
                <p className="text-blue-100 text-sm">
                  Your security is our top priority
                </p>
              </div>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2">Quick & Easy</h3>
                <p className="text-blue-100 text-sm">
                  Reset your password in minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center relative">
            <img
              className="mx-auto h-16 w-auto transform transition hover:scale-105 duration-300"
              src={logo}
              alt="Logo"
            />
            <h2 className="mt-8 text-3xl font-extrabold text-gray-900 tracking-tight">
              Forgot Password?
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Enter your email and we'll send you a verification code
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                        emailError ? "border-red-300" : "border-gray-300"
                      } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 ${
                        emailError ? "focus:ring-red-500" : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-300`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                      {emailError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
