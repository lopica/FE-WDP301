import React from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

const ExportOrderToExcel = ({ orders }) => {
  // Hàm xử lý xuất Excel
  const handleExport = () => {
    const orderData = orders.map(order => ({
      "Order ID": order._id,
      "Customer Name": order.shippingAddress.fullName,
      "Phone Number": order.shippingAddress.phone,
      "Address": order.shippingAddress.address,
      "Total Price (VND)": order.totalPrice,
      "Order Status": order.orderStatus,
      "Payment Status": order.isPayment ? "Paid" : "Unpaid",
      "Created At": new Date(order.createdAt).toLocaleString(),
    }));

    // Tạo một worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(orderData);

    // Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Xuất file Excel
    XLSX.writeFile(wb, "orders.xlsx");
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
    >
      <Download size={16} className="mr-2" />
      Export Orders to Excel
    </button>
  );
};

export default ExportOrderToExcel;
