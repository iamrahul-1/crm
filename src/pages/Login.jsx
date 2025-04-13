import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "./../assets/logo.png";
import api from "../services/api";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    submit: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);

  // Fixed email suggestions
  const emailSuggestions = [
    "shyammodi0609@gmail.com",
    "naishalparikh77@gmail.com",
    "nileshtiwari300@gmail.com",
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        return "";

      case "password":
        if (!value) return "Password is required";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setShowEmailSuggestions(true);
    }

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
      submit: "",
    }));
  };

  const handleEmailSuggestionClick = (email) => {
    setFormData((prev) => ({
      ...prev,
      email,
    }));
    setShowEmailSuggestions(false);
  };

  const filteredSuggestions = emailSuggestions.filter((email) =>
    email.toLowerCase().includes(formData.email.toLowerCase())
  );

  const isFormValid = () => {
    return (
      !Object.values(errors).some((error) => error) &&
      Object.keys(formData).every((key) => formData[key])
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    if (!isFormValid()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", formData);

      const { token } = response.data;

      // Add a delay before redirecting
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("token", token);
      toast.success("Welcome to Brookstone CRM!!");

      // Add a small delay after setting token
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/");
    } catch (err) {
      console.log("Login Error Details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        error: err.message,
      });
      const errorMessage =
        err.response?.data?.message || "Invalid email or password";
      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
      toast.error(errorMessage);

      // Add a delay for error state
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 items-center justify-center">
        <div className="max-w-md text-white space-y-6">
          <h1 className="text-4xl font-bold">Welcome to Brookstone CRM</h1>
          <p className="text-blue-100 text-lg">
            Manage your business relationships efficiently and grow your
            network.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold">Easy Management</h3>
              <p className="text-sm text-blue-100">
                Track and manage customer relationships
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-blue-100">
                Get insights about your business
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <img
              className="mx-auto h-16 w-auto transform transition hover:scale-105"
              src={logo}
              alt="Logo"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Forgot your password?{" "}
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Reset it here
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm flex items-center justify-center space-x-2 animate-shake">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{errors.submit}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setShowEmailSuggestions(true)}
                    className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "focus:ring-red-500"
                        : "focus:ring-blue-500"
                    } focus:border-transparent transition-all`}
                    placeholder="you@example.com"
                  />
                  {showEmailSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {filteredSuggestions.map((email) => (
                        <div
                          key={email}
                          onClick={() => handleEmailSuggestionClick(email)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm flex items-center"
                        >
                          <FiMail className="h-4 w-4 mr-2 text-gray-400" />
                          {email}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-10 py-2.5 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "focus:ring-red-500"
                        : "focus:ring-blue-500"
                    } focus:border-transparent transition-all`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div> */}

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Reset password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Having trouble signing in?
                </span>
              </div>
            </div>

            {/* <div className="mt-6">
              <Link
                to="/forgot-password"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Reset Password
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
