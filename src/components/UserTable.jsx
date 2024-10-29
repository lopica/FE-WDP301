import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10); // Default to 10 users per page

  const navigate = useNavigate();

  const onDetail = (userId) => {
    navigate(`/admin/user/${userId}`);
  };
  const onEdit = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:9999/api/user/change-status/${userId}`);
      const updatedUser = response.data;
      const updatedUsers = users.map((user) => (user.id === userId ? { ...user, status: updatedUser.userFound.status } : user));
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/user/all");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/role/getAll");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    // Call fetch functions
    fetchUsers();
    fetchRoles();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedRole ? user.role === selectedRole : true) &&
      (selectedType ? user.loginType === selectedType : true),
  );

  //pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePerPageChange = (e) => {
    setUsersPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPagination = () => {
    const pagination = [];

    if (totalPages <= 5) {
      pagination.push(
        pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 border border-gray-300 rounded ${currentPage === number ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              {number}
            </button>
          </li>
        )),
      );
    } else {
      pagination.push(
        <>
          <li key={1}>
            <button
              onClick={() => paginate(1)}
              className={`px-3 py-1 border border-gray-300 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              1
            </button>
          </li>
          <li key={2}>
            <button
              onClick={() => paginate(2)}
              className={`px-3 py-1 border border-gray-300 rounded ${currentPage === 2 ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              2
            </button>
          </li>
          <li key="ellipsis1">
            <span className="px-3 py-1">...</span>
          </li>
          <li key={totalPages - 1}>
            <button
              onClick={() => paginate(totalPages - 1)}
              className={`px-3 py-1 border border-gray-300 rounded ${currentPage === totalPages - 1 ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              {totalPages - 1}
            </button>
          </li>
          <li key={totalPages}>
            <button
              onClick={() => paginate(totalPages)}
              className={`px-3 py-1 border border-gray-300 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              {totalPages}
            </button>
          </li>
        </>,
      );
    }

    return pagination;
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between space-x-4 mb-4">
        {/* Search input */}
        <input type="text" placeholder="Search by email" value={searchTerm} onChange={handleSearchChange} className="px-4 py-2 border rounded-lg w-full sm:w-1/2 lg:w-1/3" />
        {/* Dropdowns for Role and Type */}
        <div className="flex space-x-4">
          {/* Role dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow">
              {selectedRole || "Role"} <ChevronDown size={18} color="#c8c8cf" className="inline-block ml-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="flex items-center">Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((role) => (
                <DropdownMenuItem key={role._id} onClick={() => handleRoleSelect(role.name)}>
                  {role.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          {/* Table headers */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Create At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.email}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  {/* <div className="text-sm text-gray-500">{user.email}</div> */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.createdAt ? format(parseISO(user.createdAt), "HH:mm:ss dd-MM-yyyy") : "N/A"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline">{user.role}</Badge>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button onClick={() => onDetail(user.id)} className=" bg-white hover:bg-gray-50 text-[#7D4600] hover:text-indigo-900 py-1 px-2 border border-gray-200 rounded shadow">
                    <Eye className="h-5 w-5 hover:opacity-85" />
                  </button>
                </td>
                <td>
                  <button onClick={() => onEdit(user.id)} className="ml-4 bg-white hover:bg-gray-50 text-indigo-600 hover:text-indigo-900 py-1 px-2 border border-gray-200 rounded shadow">
                    {user.status === true ? "Active" : "InActive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination and rows per page dropdown */}
      <div className="flex justify-between items-center mt-4">
        {/* Rows per page dropdown */}
        <div className="flex items-center">
          <span className="mr-2">Rows per page:</span>
          <select value={usersPerPage} onChange={handlePerPageChange} className="focus:outline-none px-2 py-1 border border-gray-300 rounded">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        {/* Pagination controls */}
        <nav className="block">
          <ul className="flex pl-0 rounded list-none flex-wrap">
            <li>
              <button onClick={() => paginate(currentPage - 1)} className="mr-3 px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50" disabled={currentPage === 1}>
                <ChevronLeft color="#a8a5a5" />
              </button>
            </li>
            {renderPagination()}
            <li>
              <button onClick={() => paginate(currentPage + 1)} className="ml-3 px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50" disabled={currentPage === totalPages}>
                <ChevronRight color="#a8a5a5" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default UserTable;
