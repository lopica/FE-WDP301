import React, { useContext } from "react";
import logo from "../assets/WEARIT.svg";
import { Link, useNavigate } from "react-router-dom";
import { CiUser, CiShoppingCart, CiHeart, CiLogout } from "react-icons/ci";
import { AiOutlineDashboard } from "react-icons/ai";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-hot-toast";

const Header = () => {
  const { userAuth, setUserAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:9999/api/auth/logout",
        {
          userId: userAuth.user.id,
        },
        {
          headers: {
            token: `Bearer ${userAuth.accessToken}`,
          },
        },
      );
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      setUserAuth({ accessToken: null, user: null });
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      if (error.response?.data?.message === "Token is not valid. Forbidden!") {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");
        setUserAuth({ accessToken: null, user: null });
      }
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <header className="border-b shadow-md">
      <div className="bg-black text-white py-2">
        <div className="container mx-auto flex justify-end items-center px-4">
          {userAuth.accessToken ? (
            <div>
              {userAuth.user?.name}
              <span className="ml-4 mr-4">|</span>
              {userAuth.user?.role}
            </div>
          ) : (
            <div>
              <Link to="/register">Create an account</Link>
              <span className="ml-4 mr-4">|</span>
              <Link to="/login" className="mr-5">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="brand logo" className="h-10 mr-5" />
          </Link>
          <nav>
            <Link to="/men" className="mx-2 text-lg font-semibold">
              Men
            </Link>
            <Link to="/women" className="mx-2 text-lg font-semibold">
              Women
            </Link>
            <Link to="/all-category" className="mx-2 text-lg font-semibold">
              All
            </Link>
          </nav>
        </div>
        <div className="flex items-center">
          {userAuth.user?.role === "user" && (
            <Link to="/cart" className="mr-4 relative">
              <button
                className="bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow flex items-center"
                disabled={!userAuth.accessToken || userAuth.user?.role !== "user"}
              >
                <CiShoppingCart className="h-5 w-5 opacity-75 hover:opacity-100 text-black" />
              </button>
              {/* <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">12</span> */}
            </Link>
          )}
          {userAuth.user?.role === "user" && (
            <Link to="/wishlist" className="mr-4">
              <button className="bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow" disabled={!userAuth.accessToken || userAuth.user?.role !== "user"}>
                <CiHeart className="h-5 w-5 opacity-55 hover:opacity-85 text-black" />
              </button>
            </Link>
          )}
          {/* admin */}
          {(userAuth.user?.role === "admin" || userAuth.user?.role === "seller") && (
            <Link to="/admin/dashboard" className="mr-4">
              <button className="bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow">
                <AiOutlineDashboard className="h-5 w-5 opacity-75 hover:opacity-100 text-black" />
              </button>
            </Link>
          )}

          {/* user profile */}
          {userAuth.accessToken && (
            <Link to="/user/profile" className="mr-4">
              <button className="bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow ">
                <CiUser className="h-5 w-5 opacity-55 hover:opacity-85 text-black" />
              </button>
            </Link>
          )}

          {userAuth.accessToken && (
            <>
              <span className="ml-4 mr-4 opacity-25">|</span>
              <button onClick={handleLogout} className="bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow flex items-center">
                <CiLogout className="h-5 w-5 opacity-55 hover:opacity-85 text-black" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
