import React, { useState, useEffect } from "react";
import OrderTable from "../../components/OrderTable";
import axios from "axios";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/order/all-orders"); // Replace with your API endpoint
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className=" text-3xl font-semibold text-gray-800 my-5">Orders</h1>
      <OrderTable orders={orders} />
    </div>
  );
};

export default ManageOrder;
