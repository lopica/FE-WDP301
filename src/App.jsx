import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "react-day-picker/dist/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.scss";
//instance
import instance from "./utils/index";

import HomePage from "./pages/main/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import UserProfile from "./pages/auth/UserProfile";
import ProductList from "./pages/main/ProductList";
import ProductDetail from "./pages/main/ProductDetail";
import WishList from "./pages/main/Wishlist";
import CartPage from "./pages/main/CartPage";
import Checkout from "./pages/main/Checkout";
import OrderSuccess from "./components/OrderSuccess";

import NotFoundPage from "./pages/error/NotFoundPage";
import ComingSoon from "./pages/error/ComingSoon";

//admin
import AdminLayout from "./pages/admin/Layout";
import ProtectedRouteByRole from "./components/admin/ProtectedRouteByRole";
import Dashboard from "./pages/admin/Dashboard";
import ManageBrand from "./pages/admin/ManageBrand";
import ManageCategory from "./pages/admin/ManageCategory";
import ManageProduct from "./pages/admin/ManageProduct";
import ManageUser from "./pages/admin/ManageUser";
import ManageOrder from "./pages/admin/ManageOrder";
import ManageColor from "./pages/admin/ManageColor";
import ManageType from "./pages/admin/ManageType";
import ManageTag from "./pages/admin/ManageTag";
import ManageUserDetail from "./pages/admin/ManageUserDetail";

export const UserContext = createContext({});

function App() {
  const location = useLocation();
  const [userAuth, setUserAuth] = useState({});
  const isAdminRoute = location.pathname.includes("/admin");
  const isUserRoute = location.pathname.includes("/user");

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const accessToken = sessionStorage.getItem("accessToken");
    if (user && accessToken) {
      setUserAuth({ accessToken, user: JSON.parse(user) });
    } else {
      setUserAuth({ accessToken: null });
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Toaster />
        {!isAdminRoute && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/wishlist" element={userAuth.accessToken ? <WishList /> : <Navigate to="/login" />} />
            <Route path="/cart" element={!userAuth.accessToken ? <Navigate to="/login" /> : <CartPage />} />
            <Route path="/checkout" element={!userAuth.accessToken ? <Navigate to="/login" /> : <Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/coming-soon" element={<ComingSoon />} />

            {/* <Route path="/men" element={<ProductList category="men" />} />
            <Route path="/women" element={<ProductList category="women" />} />
            <Route path="/all-category" element={<ProductList category="" />} /> */}
            <Route path="/:id" element={<ProductList />} />
            <Route path="/login" element={!userAuth.accessToken ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!userAuth.accessToken ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/user/profile" element={userAuth.accessToken ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="/forgot-password" element={!userAuth.accessToken ? <ForgotPasswordPage /> : <Navigate to="/" />} />

            {/* Admin Routes */}

            <Route element={<ProtectedRouteByRole />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/brands" element={<ManageBrand />} />
                <Route path="/admin/categories" element={<ManageCategory />} />
                <Route path="/admin/products" element={<ManageProduct />} />
                <Route path="/admin/user/:id" element={<ManageUserDetail />} />
                <Route path="/admin/users" element={<ManageUser />} />
                <Route path="/admin/orders" element={<ManageOrder />} />
                <Route path="/admin/colors" element={<ManageColor />} />
                <Route path="/admin/types" element={<ManageType />} />
                <Route path="/admin/tags" element={<ManageTag />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!isAdminRoute && !isUserRoute && <Footer />}
      </UserContext.Provider>
    </>
  );
}

export default App;
