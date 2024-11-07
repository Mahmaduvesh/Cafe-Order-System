import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const ThankYou = () => {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-purple-200 flex justify-center items-center min-h-screen p-6">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-lg text-center">
        <FaCheckCircle className="text-green-500 text-7xl mb-6 mx-auto" />
        <h1 className="text-4xl font-bold text-gray-800">Thank You!</h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Your order has been successfully received.
        </p>
        <p className="mt-2 text-lg text-gray-600 leading-relaxed">
          Please wait for your delivery.
        </p>
        <div className="mt-8">
          <button
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300"
            onClick={() => (window.location.href = "/order")}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
