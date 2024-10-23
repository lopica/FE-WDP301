import React, { useState, useEffect } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

const TableDepot = ({ depotData, productData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState(depotData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    filterData(searchTerm, selectedDate);
  }, [depotData]);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterData(term, selectedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterData(searchTerm, date);
  };

  const filterData = (term, date) => {
    let filtered = depotData.filter((depot) => {
      const product = productData.find((product) => product._id === depot.productId);
      const matchesTitle = product ? product.title.toLowerCase().includes(term.toLowerCase()) : false;
      const matchesDate = date ? isSameDay(parseISO(depot.createdAt), date) : true;
      return matchesTitle && matchesDate;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <div className="flex mb-4 space-x-4">
        <input type="text" placeholder="Search by product title" value={searchTerm} onChange={handleSearchChange} className="px-4 py-2 border rounded-md" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Import Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Import Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((depot) => (
              <tr key={depot._id}>
                <td className="px-6 py-4 whitespace-nowrap hidden">
                  <div className="text-sm text-gray-900 ">{depot.productId}</div>
                </td>
                {productData.map((product) => {
                  if (product._id === depot.productId) {
                    return (
                      <td key={product._id} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.title}</div>
                      </td>
                    );
                  }
                  return null;
                })}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{depot.importPrice} vnd</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{depot.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{depot.importTotal} vnd</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{format(parseISO(depot.createdAt), "HH:mm:ss dd-MM-yyyy")}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Showing {currentItems.length} of {filteredData.length} data
        </span>
        <div className="flex space-x-1">
          <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 border rounded">
            Previous
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button key={page + 1} onClick={() => handleChangePage(page + 1)} className={`px-2 py-1 border rounded ${currentPage === page + 1 ? "bg-blue-500 text-white" : ""}`}>
              {page + 1}
            </button>
          ))}
          <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded">
            Next
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="itemsPerPage" className="mr-2">
          {" "}
          Items per page:{" "}
        </label>
        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="p-2 border rounded">
          <option value={8}>8</option>
          <option value={16}>16</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default TableDepot;
