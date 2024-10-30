import React, { useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, DollarSign, Receipt, Check, X, Truck } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import ExportOrderToExcel from "./admin/ExportOrderToExcel ";

const OrderTable = ({ orders }) => {
  const completedOrders = orders.filter((order) => order.orderStatus === "completed");
  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalPrice, 0);
  const ordersCount = orders.length;
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10); // Default to 10 orders per page
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const filters = ["All", "shipping", "pending", "cancelled", "completed"];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page whenever the filter changes
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusUpdate = () => {
    axios
      .put(`http://localhost:9999/api/order/status/${selectedOrderId}`, { status: selectedStatus })
      .then(() => {
        toast.success("Order status updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        toast.error("Failed to update order status");
      });
  };

  const handleStatusClick = (orderId, status) => {
    setSelectedOrderId(orderId);
    setSelectedStatus(status);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter((order) => {
    if (activeFilter !== "All" && activeFilter !== order.orderStatus) {
      return false;
    }
    if (searchTerm && !order._id.toLowerCase().includes(searchTerm.toLowerCase()) && !order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <li key={number}>
        <button
          onClick={() => paginate(number)}
          className={`px-3 py-1 border border-gray-300 rounded ${currentPage === number ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-white text-gray-700 hover:bg-gray-50"}`}
        >
          {number}
        </button>
      </li>
    ));
  };

  return (
    <>
      <div className="flex items-center justify-between space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by Order ID or Customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-1/2 lg:w-1/3"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between">
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <div>
                <p className="text-xl font-semibold">{formatCurrency(totalRevenue)}</p>
                <h2 className="text-base font-normal mt-2">Total Revenue</h2>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-[#ecf2ff] rounded-full w-16 h-16 flex items-center justify-center">
                <DollarSign size={20} color="#CA5E5E" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between">
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <div>
                <p className="text-xl font-semibold">{ordersCount}</p>
                <h2 className="text-base font-normal mt-2">Orders</h2>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-[#ecf2ff] rounded-full w-16 h-16 flex items-center justify-center">
                <Receipt size={20} color="#CA5E5E" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* =========================================== TABLE ===========================*/}
      <div className="p-4 bg-white shadow-sm rounded-lg">
        <div className="grid grid-cols-5  ">
          <div className="col-span-2 flex justify-between items-center bg-gray-100 p-1 rounded-lg shadow-sm">
            {filters.map((filter) => (
              <button key={filter} className={`px-3 py-1 rounded-md ${activeFilter === filter ? "bg-white text-black shadow-md" : "text-gray-500"}`} onClick={() => handleFilterChange(filter)}>
                {filter}
              </button>
            ))}
          </div>
          {/* <div className="col-span-3 flex justify-end">
            <ExportOrderToExcel orders={orders} />
          </div> */}
        </div>
        <table className="min-w-full table-auto mt-10">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 cursor-pointer" onClick={() => handleSort("_id")}>
                Order No.
              </th>
              <th className="text-left py-2 px-4 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Date
                <ArrowUpDown size={18} className="inline-block ml-3 opacity-50" style={{ marginBottom: "4px" }} />
              </th>
              <th className="text-left py-2 px-4">Customer</th>
              <th className="text-left py-2 px-4">Payment</th>
              <th className="text-left py-2 px-4 cursor-pointer" onClick={() => handleSort("totalPrice")}>
                Total
                <ArrowUpDown size={18} className="inline-block ml-3 opacity-50" style={{ marginBottom: "4px" }} />
              </th>
              <th className="text-left py-2 px-4">Items</th>
              <th className="text-left py-2 px-4">Fulfillment</th>
              <th className="text-left py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{indexOfFirstOrder + index + 1}</td>
                <td className="py-2 px-4">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4">{order.shippingAddress.fullName}</td>
                <td className="py-2 px-4">
                  <span className={`shadow-sm px-2 py-1 rounded-full text-sm ${order.isPayment ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                    {order.isPayment ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="py-2 px-4">{order.totalPrice}₫</td>
                <td className="py-2 px-4">{order.orderItems.length} items</td>
                <td className="py-2 px-4">
                  <span
                    className={`shadow-sm px-2 py-1 rounded-full text-sm ${
                      order.orderStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.orderStatus === "shipping"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="bg-white hover:bg-gray-50 text-[#7D4600] hover:text-indigo-900 py-1 px-2 border border-gray-200 rounded shadow" onClick={() => handleOrderClick(order)}>
                        <Eye className="h-5 w-5 hover:opacity-85" />
                      </button>
                    </DialogTrigger>
                    {selectedOrder && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                          <DialogDescription>View the details of your order. Click save when you're done.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-12 gap-4 mb-4 border-b pb-2">
                            {/* <label className="col-span-2">Image</label> */}
                            <label className="col-span-3">Product</label>
                            <label className="col-span-2">Color</label>
                            <label className="col-span-1">Size</label>
                            <label className="col-span-2">Price</label>
                            <label className="col-span-2">Quantity</label>
                          </div>
                          {selectedOrder.orderItems.map((item, index) => (
                            <div key={`${item.productId._id}-${index}`} className="grid grid-cols-12 gap-4 items-center mb-4 border-b pb-2">
                              {/* <div className="col-span-2"> <img src={item.productId.thumbnail} alt={item.productTitle} className="w-16" /> </div> */}
                              <div className="col-span-3">
                                <div className="font-semibold">{item.productTitle || "Product Title"}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color }}></div>
                              </div>
                              <div className="col-span-1">{item.size}</div>
                              <div className="col-span-2">{item.price.toLocaleString("en-US")}</div>
                              <div className="col-span-2">{item.quantity}</div>
                            </div>
                          ))}
                        </div>
                        {/* Delivery Address */}
                        <div className="grid gap-4 mb-4">
                          <div className="grid grid-cols-2">
                            <p>
                              <strong>Full name:</strong>
                            </p>
                            <p>{selectedOrder.shippingAddress.fullName}</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p>
                              <strong>Phone number:</strong>
                            </p>
                            <p>{selectedOrder.shippingAddress.phone}</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p>
                              <strong>Address:</strong>
                            </p>
                            <p>{selectedOrder.shippingAddress.address}</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p>
                              <strong>Specific Address:</strong>
                            </p>
                            <p>{selectedOrder.shippingAddress.specificAddress}</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p>
                              <strong>Total Price:</strong>
                            </p>
                            <p>{selectedOrder.totalPrice} VND</p>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                  {order.orderStatus === "pending" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="ml-4 bg-white hover:bg-gray-50 text-blue-800 hover:text-blue-800 py-1 px-2 border border-gray-200 rounded shadow"
                          onClick={() => handleStatusClick(order._id, "shipping")}
                        >
                          <Truck className="h-5 w-5 opacity-55 hover:opacity-85" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will change the order status to <span className="text-blue-800 font-semibold italic">Shipping.</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleStatusUpdate}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {order.orderStatus === "shipping" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="ml-4 bg-white hover:bg-gray-50 text-green-600 hover:text-green-900 py-1 px-2 border border-gray-200 rounded shadow"
                          onClick={() => handleStatusClick(order._id, "completed")}
                        >
                          <Check className="h-5 w-5 opacity-55 hover:opacity-85" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will change the order status to <span className="text-green-800 font-semibold italic">Completed.</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleStatusUpdate}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {order.orderStatus !== "cancelled" && order.orderStatus !== "completed" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="ml-4 bg-white hover:bg-gray-50 text-red-600 hover:text-red-900 py-1 px-2 border border-gray-200 rounded shadow"
                          onClick={() => handleStatusClick(order._id, "cancelled")}
                        >
                          <X className="h-5 w-5 opacity-55 hover:opacity-85" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will change the order status to <span className="text-red-800 font-semibold italic">Cancelled.</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleStatusUpdate}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-sm text-gray-700">
          Showing {indexOfFirstOrder + 1} to {indexOfLastOrder > filteredOrders.length ? filteredOrders.length : indexOfLastOrder} of {filteredOrders.length} entries
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="mr-2">Rows per page:</span>
            <select
              value={ordersPerPage}
              onChange={(e) => {
                setOrdersPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="focus:outline-none px-2 py-1 border border-gray-300 rounded"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
              <li>
                <button onClick={() => paginate(currentPage - 1)} className="mr-3 px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50" disabled={currentPage === 1}>
                  <ChevronLeft color="#a8a5a5" />
                </button>
              </li>
              {renderPagination()}
              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="ml-3 px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight color="#a8a5a5" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default OrderTable;
