import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Adjust this import according to your project structure
import { Gauge, FolderKanban, Settings, PackageSearch, ClipboardType, BadgeCheck, PackageOpen, PaintBucket, UsersRound, NotebookText, BaggageClaim, Home, Tags } from "lucide-react";
import { UserContext } from "@/App"; // Adjust this import according to your project structure

const SideBarAdmin = () => {
  const { userAuth } = useContext(UserContext);
  const userRole = userAuth?.user?.role;

  return (
    <div className="bg-white w-64 p-4 transition-all duration-300">
      <div className="sidebar-container sticky top-0">
        <div className="text-center mb-4">
          <img src="https://via.placeholder.com/150" alt="Profile" className="w-12 h-12 rounded-full mx-auto mb-2" />
          <div>
            <p className="text-sm font-semibold">Hi {userAuth?.user?.name}</p>
            <p className="text-xs text-gray-500">@{userRole}</p>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="homepage">
            <Link to="/" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded font-medium">
              <Home size={20} className="mr-3" /> Home Page
            </Link>
          </AccordionItem>
          {(userRole === "admin" || userRole === "seller") && (
            <>
              <AccordionItem value="dashboard">
                <Link to="/admin/dashboard" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded font-medium">
                  <Gauge size={20} className="mr-3" /> Dashboard
                </Link>
              </AccordionItem>
              <AccordionItem value="orders">
                <Link to="/admin/orders" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded font-medium">
                  <BaggageClaim size={20} className="mr-3" /> Orders
                </Link>
              </AccordionItem>
            </>
          )}
          {userRole === "admin" && (
            <>
              <AccordionItem value="crud">
                <AccordionTrigger className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                  <FolderKanban size={20} className="mr-3" /> Manage
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-8 space-y-2">
                    <li>
                      <Link to="/admin/users" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        <UsersRound size={20} className="mr-3" /> Users
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/products" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        <PackageSearch size={20} className="mr-3" /> Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/types" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        <ClipboardType size={20} className="mr-3" /> Types
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/tags" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        <Tags size={20} className="mr-3" /> Tags
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/brands" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        <BadgeCheck size={20} className="mr-3" /> Brands
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/categories" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        <PackageOpen size={20} className="mr-3" /> Categories
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/colors" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        <PaintBucket size={20} className="mr-3" /> Colors
                      </Link>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="settings">
                <Link to="/admin/settings" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded font-medium">
                  <Settings size={20} className="mr-3" /> Settings
                </Link>
              </AccordionItem>
              <AccordionItem value="pages">
                <AccordionTrigger className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                  <NotebookText size={20} className="mr-3" /> Pages
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-8 space-y-2">
                    <li>
                      <Link to="/admin/about" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/contact" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </>
          )}
          <AccordionItem value="github">
            <a href="https://github.com/dnthchung/HolaWear" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
              <FaGithub className="mr-3" /> GitHub Repository
            </a>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SideBarAdmin;
