import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9999/api/auth/forgot-password", {
        email,
      });
      if (response.status === 200) {
        toast.success("Verification code sent to your email. Please check your email.");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-44">
      <div className="w-full max-w-md p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-center">
            <h2 className="text-3xl font-bold mb-4">Forgot Password</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="flex justify-center text-gray-700 mb-5" htmlFor="email">
                Enter your email to receive a verification code
              </label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="email@domain.com" />
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
              Send
            </button>
          </form>
          <button onClick={handleBackToLogin} className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded mt-4 hover:bg-gray-300">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
