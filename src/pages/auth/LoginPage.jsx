import React, { useState, useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import banner1 from "../../assets/banner.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../../App";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const googleAuth = () => {
    window.open(`http://localhost:9999/api/auth/google/callback`, "_self");
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserContext); // Use setUserAuth from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const savedProductSelectionString = localStorage.getItem("productSelection");
      const savedProductSelection = savedProductSelectionString ? JSON.parse(savedProductSelectionString) : null;
      // console.log(savedProductSelection);
      const response = await axios.post("http://localhost:9999/api/auth/signin", {
        email,
        password,
        productSelection: savedProductSelection,
      });
      if (response.status === 201) {
        toast.success("Login successful");
        const { access_token } = response.data;

        const user = jwtDecode(access_token);
        console.log(jwtDecode(access_token));
        if (rememberMe) {
          localStorage.setItem("accessToken", access_token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("accessToken", access_token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        setUserAuth({ accessToken: access_token, user }); // Update context

        // Clear the saved product selection after login
        localStorage.removeItem("productSelection");
        // Redirect to the product detail page if product selection is available
        if (user.role === "admin") {
          navigate("/");
          return;
        }
        if (savedProductSelection) {
          const { productId, selectedColor, selectedSize, quantity } = savedProductSelection;
          navigate(`/product/${productId}`, { state: { selectedColor, selectedSize, quantity } });
        } else {
          navigate("/"); // Redirect to home if no product selection
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-44">
      <div className="w-full max-w-4xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-lg">
          <div>
            <div className="flex justify-center">
              <h2 className="text-3xl font-bold mb-4">Login</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="flex justify-center text-gray-700 mb-5" htmlFor="email">
                  Enter your email & password to log in
                </label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="email@domain.com" />
              </div>
              <div className="mb-4">
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Password" />
              </div>
              <div className="mb-4 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)} // Update state
                  />
                  <span className="ml-2">Remember Me</span>
                </label>
                <Link to={"/forgot-password"} className="text-sm text-blue-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
                Login
              </button>
            </form>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-gray-600">or continue with</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
            <button onClick={googleAuth} className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded flex items-center justify-center mt-4">
              <FaGoogle className="mr-2" /> Google
            </button>
          </div>
          <div>
            <img src={banner1} alt="Advertisement" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
