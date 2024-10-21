import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { parseISO, getMonth, getYear, format } from "date-fns";
import { DollarSign, Users, Receipt, Calendar as CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import TopProductsSold from "../../components/admin/TopProductsSold";

// Date Picker Component
function DatePickerDemo({ date, setDate }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={`w-[280px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM yyyy") : <span>Pick a Month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [depotProductsData, setDepotProductsData] = useState([]);
  const [date, setDate] = useState(null); // State for selected date
  const [maxY, setMaxY] = useState(50);
  const [stepSize, setStepSize] = useState(2);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/order/all-orders");
        setOrdersData(response.data);
      } catch (error) {
        console.error("Error fetching orders data", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/user/all");
        setUsersData(response.data);
      } catch (error) {
        console.error("Error fetching users data", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/product/get-all-product");
        setProductsData(response.data.products); // Assuming the response structure
      } catch (error) {
        console.error("Error fetching products data", error);
      }
    };

    const fetchDepotProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/depotProduct/get-all-product");
        setDepotProductsData(response.data.productDepots);
      } catch (error) {
        console.error("Error fetching depot products data", error);
      }
    };

    fetchOrders();
    fetchUsers();
    fetchProducts();
    fetchDepotProducts();
  }, []);

  const filterDataByMonth = (data) => {
    if (!date) return data;
    return data.filter((item) => {
      const itemDate = parseISO(item.createdAt);
      return getMonth(itemDate) === getMonth(date) && getYear(itemDate) === getYear(date);
    });
  };

  const filteredOrders = filterDataByMonth(ordersData);
  const filteredDepotProducts = filterDataByMonth(depotProductsData);

  const countRoles = (users) => {
    const counts = { admin: 0, seller: 0, user: 0 };
    users.forEach((user) => {
      if (counts[user.role] !== undefined) {
        counts[user.role]++;
      }
    });
    return counts;
  };

  const roleCounts = countRoles(usersData);
  const roleData = {
    labels: ["Admin", "Seller", "User"],
    datasets: [
      {
        data: [roleCounts.admin, roleCounts.seller, roleCounts.user],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
        hoverOffset: 4,
      },
    ],
  };

  const countOrdersPerMonth = (orders) => {
    const counts = Array(12).fill(0);
    orders.forEach((order) => {
      const month = parseISO(order.createdAt).getMonth();
      counts[month]++;
    });
    return counts;
  };

  const ordersPerMonth = countOrdersPerMonth(filteredOrders);
  const ordersDataChart = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Orders Completed",
        data: ordersPerMonth,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: "blue",
          font: {
            size: 13,
          },
        },
        grid: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: maxY,
        ticks: {
          stepSize: stepSize,
        },
      },
    },
  };

  const totalRevenue = filteredOrders.filter((order) => order.orderStatus === "completed").reduce((acc, order) => acc + order.totalPrice, 0);
  const totalImportPrice = filteredDepotProducts.reduce((acc, product) => acc + product.importTotal, 0);

  const profitLoss = totalRevenue - totalImportPrice;
  const profitLossStyle = profitLoss >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold";

  const ordersCount = filteredOrders.length;
  const activeSessions = usersData.length;
  const totalSessions = productsData.length;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <div className="p-4">
      <div className="p-4">
        <div className="mb-4">
          <DatePickerDemo date={date} setDate={setDate} />
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            {/* Total Revenue */}
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
                    <ArrowDown size={30} color="#CA5E5E" />
                  </div>
                </div>
              </div>
            </div>
            {/* Total Import Price */}
            <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between">
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <div>
                    <p className="text-xl font-semibold">{formatCurrency(totalImportPrice)}</p>
                    <h2 className="text-base font-normal mt-2">Total Import Price</h2>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-[#ecf2ff] rounded-full w-16 h-16 flex items-center justify-center">
                    <ArrowUp size={30} color="#CA5E5E" />
                  </div>
                </div>
              </div>
            </div>
            {/* Profit/Loss */}
            <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between">
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <div>
                    <p className={`text-xl ${profitLossStyle}`}>{formatCurrency(profitLoss)}</p>
                    <h2 className="text-base font-normal mt-2">Profit/Loss</h2>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className={`bg-[#ecf2ff] rounded-full w-16 h-16 flex items-center justify-center ${profitLoss >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                    {profitLoss >= 0 ? <ArrowUp size={30} color="#CA5E5E" /> : <ArrowDown size={30} color="#CA5E5E" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="my-4 border-t-2"></div> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          {/* Orders */}
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
          {/* Active Sessions */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between">
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <div>
                  <p className="text-xl font-semibold">{activeSessions}</p>
                  <h2 className="text-base font-normal mt-2">Active Sessions</h2>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-[#ecf2ff] rounded-full w-16 h-16 flex items-center justify-center">
                  <Users size={20} color="#CA5E5E" />
                </div>
              </div>
            </div>
          </div>
          {/* Total Sessions */}
          <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between">
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <div>
                  <p className="text-xl font-semibold">{totalSessions}</p>
                  <h2 className="text-base font-normal mt-2">Total Products</h2>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-[#ecf2ff] rounded-full w-16 h-16 flex items-center justify-center">
                  <DollarSign size={20} color="#CA5E5E" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm rounded-lg p-4 col-span-2">
          <h2 className="text-xl font-bold mb-4">Orders Over Time</h2>
          <Line data={ordersDataChart} options={options} />
          <div className="mt-4">
            <label className="mr-2">Max Y:</label>
            <input type="number" value={maxY} onChange={(e) => setMaxY(Number(e.target.value))} className="border rounded p-1" />
            <label className="ml-4 mr-2">Step Size:</label>
            <input type="number" value={stepSize} onChange={(e) => setStepSize(Number(e.target.value))} className="border rounded p-1" />
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 col-span-1">
          <h2 className="text-xl font-bold mb-4">User Roles Distribution</h2>
          <Pie data={roleData} options={options} />
        </div>
      </div>
      {/* Top Products */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopProductsSold productsData={productsData} />
      </div>
    </div>
  );
};

export default Dashboard;
