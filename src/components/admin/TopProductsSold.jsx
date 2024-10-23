import React, { useState, useEffect } from "react";
import axios from "axios";

const TopProductsSold = () => {
  const [productsData, setProductsData] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/order/top-products");
        setProductsData(response.data);
      } catch (error) {
        console.error("Error fetching the products data", error);
      }
    };

    fetchProductsData();
  }, []);

  const filteredProducts = productsData.filter((product) => product.productTitle.toLowerCase().includes(productSearch.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Top Products by Units Sold</h2>
      <input type="text" placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="mb-4 p-2 border rounded w-full" />
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">Name</th>
            <th className="text-left py-2 px-4">Units Sold</th>
            <th className="text-left py-2 px-4">Size</th>
            <th className="text-left py-2 px-4">Color</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 flex items-center">
                {product.productThumbnail && <img src={product.productThumbnail} alt={product.productTitle} className="w-8 h-8 rounded mr-2" />}
                {product.productTitle}
              </td>
              <td className="py-2 px-4">{product.quantity}</td>
              <td className="py-2 px-4">{product.productSize}</td>
              <td className="py-2 px-4">
                <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: product.productColor }}></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Showing {currentProducts.length} of {filteredProducts.length} data
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
          Items per page:
        </label>
        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="p-2 border rounded">
          <option value={5}>5</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default TopProductsSold;
