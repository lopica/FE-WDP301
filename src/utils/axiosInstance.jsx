import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../App";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      let date = new Date();
      if (decodedToken.exp < date.getTime() / 1000) {
        console.log("Token expired");
        toast.error("Session expired. Please sign in again");
      } else {
        config.headers["token"] = `Bearer ${accessToken}`;
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user && user.id) {
          config.headers["userId"] = user.id;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
