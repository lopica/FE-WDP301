import React, { useState } from "react";

const RecentTransactions = ({ transactionsData }) => {
  const [transactionSearch, setTransactionSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredTransactions = transactionsData.filter((transaction) =>
    transaction.name.toLowerCase().includes(transactionSearch.toLowerCase()),
  );

  const totalTransactionPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <input
        type="text"
        placeholder="Search user..."
        value={transactionSearch}
        onChange={(e) => setTransactionSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">Name</th>
            <th className="text-left py-2 px-4">Date</th>
            <th className="text-left py-2 px-4">Amount</th>
            <th className="text-left py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{transaction.name}</td>
              <td className="py-2 px-4">{transaction.date}</td>
              <td className="py-2 px-4">{transaction.amount}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    transaction.status === "paid" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Showing {currentTransactions.length} of {filteredTransactions.length} data
        </span>
        <div className="flex space-x-1">
          <button
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded"
          >
            Previous
          </button>
          {[...Array(totalTransactionPages).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => handleChangePage(page + 1)}
              className={`px-2 py-1 border rounded ${currentPage === page + 1 ? "bg-blue-500 text-white" : ""}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalTransactionPages}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="itemsPerPage" className="mr-2">
          Items per page:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="p-2 border rounded"
        >
          <option value={5}>5</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default RecentTransactions;
