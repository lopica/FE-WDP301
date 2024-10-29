import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaShoppingBag } from "react-icons/fa";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SideBarUser = () => {
  return (
    <div className="bg-white w-64 p-4 transition-all duration-300">
      <div className="sidebar-container sticky top-0">
        <div className="text-center mb-4">
          <img src="https://via.placeholder.com/150" alt="Profile" className="w-12 h-12 rounded-full mx-auto mb-2" />
          <div>
            <p className="text-sm font-semibold">Hi Chung</p>
            <p className="text-xs text-gray-500">@customer</p>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="account">
            <Link
              to="/user/account"
              className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded font-medium"
            >
              <FaUser size={20} className="mr-3" /> My Account
            </Link>
          </AccordionItem>
          <AccordionItem value="purchase">
            <AccordionTrigger className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
              <FaShoppingBag size={20} className="mr-3" /> My Purchase
            </AccordionTrigger>
            <AccordionContent>
              <ul className="pl-8 space-y-2">
                <li>
                  <Link
                    to="/user/purchase/all"
                    className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded"
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/purchase/to-pay"
                    className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded"
                  >
                    To Pay
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/purchase/to-ship"
                    className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded"
                  >
                    To Ship
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/purchase/to-receive"
                    className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded"
                  >
                    To Receive
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/purchase/completed"
                    className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded"
                  >
                    Completed
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/purchase/cancelled"
                    className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded"
                  >
                    Cancelled
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/purchase/return-refund"
                    className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded"
                  >
                    Return Refund
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SideBarUser;
