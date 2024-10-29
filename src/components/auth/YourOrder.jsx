import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import image1 from "../../assets/pleased.png";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/App";
import { toast } from "react-hot-toast";
import { format, parseISO, isSameDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const YourOrder = () => {
  const { userAuth } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/api/order/user-orders/${userAuth.user.id}`)
      .then((response) => {
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, [userAuth.user.id]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    filterOrders(status, selectedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterOrders(selectedStatus, date);
  };

  const filterOrders = (status, date) => {
    let filtered = orders;
    if (status !== "all") {
      filtered = filtered.filter((order) => order.orderStatus === status);
    }
    if (date) {
      filtered = filtered.filter((order) => isSameDay(parseISO(order.createdAt), date));
    }
    setFilteredOrders(filtered);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post("http://localhost:9999/api/order/cancel-order", { orderId });
      if (response.status === 200) {
        const updatedOrder = response.data;
        setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? updatedOrder : order)));
        setFilteredOrders((prevFilteredOrders) => prevFilteredOrders.map((order) => (order._id === orderId ? updatedOrder : order)));
        toast.success("Order cancelled successfully");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const handleConfirmReceipt = async (orderId) => {
    try {
      const response = await axios.post("http://localhost:9999/api/order/user-payment", { orderId });
      if (response.status === 201) {
        const updatedOrder = response.data;
        setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? updatedOrder : order)));
        setFilteredOrders((prevFilteredOrders) => prevFilteredOrders.map((order) => (order._id === orderId ? updatedOrder : order)));
        toast.success("Order receipt confirmed");
      }
    } catch (error) {
      console.error("Error confirming receipt:", error);
      toast.error("Failed to confirm receipt");
    }
  };

  return (
    <div className="your-order-container">
      <div className="flex justify-between mb-4">
        <Select value={selectedStatus} onValueChange={handleStatusChange} className="w-1/4">
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="w-1/4 justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      <div className="orders-list grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredOrders.map((order, index) => (
          <div key={order._id} className="bg-white p-4 rounded shadow-md">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Order number: {index + 1}</h3>
            </div>
            {/* card in4 */}
            <div className="grid gap-4 mb-4">
              <div className="grid grid-cols-2">
                <p>
                  <strong>Full name:</strong>
                </p>
                <p>{order.shippingAddress.fullName}</p>
              </div>
              <div className="grid grid-cols-2">
                <p>
                  <strong>Total Price:</strong>
                </p>
                <p className="text-red-500 font-semibold">{order.totalPrice} VND</p>
              </div>
              <div className="grid grid-cols-2">
                <p>
                  <strong>Created At:</strong>
                </p>
                <p>{format(parseISO(order.createdAt), " HH:mm dd-MM-yyyy")}</p>
              </div>
              <div className="grid grid-cols-2">
                <p>
                  <strong>Status:</strong>
                </p>
                <p>
                  {order.orderStatus === "completed" && <span className="font-semibold text-green-500 uppercase">{order.orderStatus}</span>}
                  {order.orderStatus === "pending" && <span className="text-yellow-500 font-semibold flex">PENDING</span>}
                  {order.orderStatus === "shipping" && <span className="font-semibold text-green-500 uppercase">{order.orderStatus}</span>}
                  {order.orderStatus === "cancelled" && <span className="font-semibold text-red-500 uppercase">{order.orderStatus}</span>}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleOrderClick(order)}>
                    View Details
                  </Button>
                </DialogTrigger>
                {selectedOrder && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                      <DialogDescription>View the details of your order. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-12 gap-4 mb-4 border-b pb-2">
                        <label className="col-span-2">Image</label>
                        <label className="col-span-3">Product</label>
                        <label className="col-span-2">Color</label>
                        <label className="col-span-1">Size</label>
                        <label className="col-span-2">Price</label>
                        <label className="col-span-2">Quantity</label>
                      </div>
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={`${item.productId._id}-${index}`} className="grid grid-cols-12 gap-4 items-center mb-4 border-b pb-2">
                          <div className="col-span-2">
                            <img src={item.thumbnail} alt={item.productTitle} className="w-16" />
                          </div>
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
                    {/* deliveryAddress:  */}
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
                    {selectedOrder.orderStatus === "shipping" && (
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setActionType("cancel");
                            setAlertOpen(true);
                          }}
                        >
                          Cancel Order
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setActionType("confirm");
                            setAlertOpen(true);
                          }}
                        >
                          Confirm Received
                        </Button>
                      </DialogFooter>
                    )}
                    {selectedOrder.orderStatus === "pending" && (
                      <div className="font-semibold text-red-600 flex justify-end items-center">
                        <img src={image1} alt="pleased" className="w-10 h-10 mr-7" />
                        <i>Please waiting for the order to be approved!</i>
                      </div>
                    )}
                    {selectedOrder.orderStatus === "completed" && (
                      <div className="font-semibold text-green-500 flex justify-end items-center">
                        <img src={image1} alt="pleased" className="w-10 h-10 mr-7" />
                        <i>Thanks for your order! We hope you enjoy your purchase. If you have any questions or concerns, please don't hesitate to contact us.</i>
                      </div>
                    )}
                  </DialogContent>
                )}
              </Dialog>
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmation</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>{actionType === "cancel" ? "Are you sure you want to cancel this order?" : "Have you received this order?"}</AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (actionType === "cancel") {
                          handleCancelOrder(selectedOrder._id);
                        } else {
                          handleConfirmReceipt(selectedOrder._id);
                        }
                        setAlertOpen(false);
                        setDialogOpen(false);
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourOrder;
