import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import logo from "../assets/WEARIT.svg";

const Footer = () => {
  return (
    <footer className="bg-white mt-40 py-10 border-t-2 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex justify-center md:justify-start items-center mb-4 md:mb-0">
            <img src={logo} alt="HolaWear Logo" className="h-32" />
          </div>
          <div className="flex space-x-4">
            <FaTwitter className="text-gray-600 hover:text-gray-900" />
            <FaLinkedin className="text-gray-600 hover:text-gray-900" />
            <FaFacebook className="text-gray-600 hover:text-gray-900" />
            <FaInstagram className="text-gray-600 hover:text-gray-900" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div className="text-center md:text-left">
            <p className="text-gray-600">Success or failure in business depends more on attitude in thinking than in ability to think.</p>
          </div>
          <div className="text-center md:text-left ">
            <h3 className="font-bold text-gray-900 mb-2">About us</h3>
            <ul className="text-gray-600">
              <li>Customers rate</li>
              <li>Contact</li>
              <li>Q&A</li>
            </ul>
          </div>
          <div className="text-center md:text-left ">
            <h3 className="font-bold text-gray-900 mb-2">Policy</h3>
            <ul className="text-gray-600">
              <li>Shipping policy</li>
              <li>Warranty Policy</li>
            </ul>
          </div>
          <div className="text-center md:text-left ">
            <h3 className="font-bold text-gray-900 mb-2">Support Line (Free Call)</h3>
            <ul className="text-gray-600">
              <li>Call to buy: 1800.xxxx (7:30 - 22:00)</li>
              <li>Technical: 1800.xyxy (7:30 - 22:00)</li>
              <li>Complaints: 1800.xzxz (8:00 - 21:30)</li>
              <li>Warranty: 1800.xyzt (8:00 - 21:00)</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex justify-center md:justify-between items-center">
          <p className="text-gray-600 text-sm">© 2024 HolaWear. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
