import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "test@gmail.com" && password === "123456") {
      toast.success("Login successful");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded-lg w-full p-3 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg w-full p-3 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-lg w-full p-3 hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
