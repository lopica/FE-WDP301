import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import addressData from "../../data/address.js";

const Checkout = () => {
  const { state } = useLocation();
  console.log(state)
  const { products, subtotal, shipping, total } = state || {};
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { userAuth, setUserAuth } = useContext(UserContext);
  const userId = userAuth?.user?.id;
  const [addresses, setAddresses] = useState(userAuth?.user?.shippingAddress || []);
  const orderStatus = "pending";
  const isPayment = false;
  const [newAddress, setNewAddress] = useState({ fullName: "", phone: "", address: "", specificAddress: "" });
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [addressToDelete, setAddressToDelete] = useState(null);

  const provinces = addressData.map((province) => province.Name);
  const districts = selectedProvince ? addressData.find((province) => province.Name === selectedProvince).Districts.map((district) => district.Name) : [];
  const wards = selectedDistrict
    ? addressData
        .find((province) => province.Name === selectedProvince)
        .Districts.find((district) => district.Name === selectedDistrict)
        .Wards.map((ward) => ward.Name)
    : [];

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:9999/api/user/delete-address/${userId}?addressId=${id}`);
      if (response.status === 200) {
        const updatedAddresses = response.data.shippingAddress;
        setAddresses(updatedAddresses);
        const updatedUserAuth = { ...userAuth, user: response.data };
        setUserAuth(updatedUserAuth); // Update context
        sessionStorage.setItem("user", JSON.stringify(response.data));
        toast.success("Address deleted successfully!");
      } else {
        toast.error("Failed to delete address!");
      }
    } catch (error) {
      toast.error("Error deleting address!");
    }
  };

  const handleAdd = async () => {
    if (!newAddress.fullName.trim() || !newAddress.phone.trim() || !newAddress.address.trim() || !newAddress.specificAddress.trim()) {
      toast.error("All fields are required!");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:9999/api/user/add-address/${userId}`, newAddress);
      if (response.status === 201) {
        const updatedAddresses = response.data.shippingAddress;
        setAddresses(updatedAddresses);
        const updatedUserAuth = { ...userAuth, user: response.data };
        setUserAuth(updatedUserAuth); // Update context
        sessionStorage.setItem("user", JSON.stringify(response.data));
        toast.success("Address added successfully!");
        setNewAddress({ fullName: "", phone: "", address: "", specificAddress: "" });
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
      } else {
        toast.error("Failed to add address!");
      }
    } catch (error) {
      toast.error("Error adding address!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard("");
  };

  const handleWardChange = (value) => {
    setSelectedWard(value);
  };

  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      setNewAddress((prevState) => ({ ...prevState, address: `${selectedWard} - ${selectedDistrict} - ${selectedProvince}` }));
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  useEffect(() => {
    if (userAuth?.user) {
      setIsLoading(false);
    }
  }, [userAuth]);

  useEffect(() => {
    if (!state || !products || !subtotal || !shipping || !total) {
      toast.error("You must check out from the cart first.");
      navigate("/");
    }
  }, [state, products, subtotal, shipping, total, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    const orderItems = products.map((product) => ({
      thumbnail: product.thumbnail,
      productTitle: product.productTitle,
      productId: product.productId,
      color: product.color,
      size: product.size,
      quantity: product.quantity,
      price: product.price,
    }));
    const shippingAddress = addresses.find((address) => address._id === selectedAddress);
    const totalPrice = parseFloat(total.replace(/,/g, ""));
    try {
      const orderResponse = await axios.post("http://localhost:9999/api/order/create-order", {
        userId: userId,
        orderItems: orderItems,
        shippingAddress: shippingAddress,
        totalPrice: totalPrice,
        orderStatus: orderStatus,
      });
      if (orderResponse.status === 201) {
        toast.success("Order created successfully");
        // Remove ordered items from cart
        await axios.post("http://localhost:9999/api/cart/remove-ordered-items", {
          userId: userId,
          orderedItems: orderItems,
        });
        setTimeout(() => {
          navigate("/order-success");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.status === 404) {
          toast.error("User or product not found");
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message || "An error occurred while creating the order. Please try again later.");
          setTimeout(() => {
            navigate("/cart");
          }, 2000);
        } else {
          toast.error("An error occurred: " + error.response.data.message);
        }
      } else if (error.request) {
        // No response was received from the server
        toast.error("No response from server. Please try again later.");
      } else {
        // Something happened while setting up the request
        toast.error("An error occurred while creating the order: " + error.message);
      }
      console.error("Error creating order", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="p-4 mt-6">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            {addresses.map((address) => (
              <label key={address._id} className="bg-white p-4 rounded shadow-md cursor-pointer">
                <input type="radio" name="deliveryAddress" value={address._id} id={`address-${address._id}`} onChange={() => setSelectedAddress(address._id)} className="mr-2" />
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Full name: {address.fullName}</h3>
                </div>
                <div className="mb-4">
                  <p>
                    {" "}
                    Phone number: <i>{address.phone}</i>{" "}
                  </p>
                  <p>
                    {" "}
                    Address: <i>{address.address}</i>{" "}
                  </p>
                  <p>
                    {" "}
                    Specific Address: <i>{address.specificAddress}</i>{" "}
                  </p>
                </div>
                <div className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" onClick={() => setAddressToDelete(address._id)}>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the address.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(addressToDelete)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-red-500 font-semibold italic">No addresses found.</p>
          </div>
        )}
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Address</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shipping Address</DialogTitle>
                <DialogDescription>Fill in the details below to add a new shipping address.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" value={newAddress.fullName} onChange={handleChange} />
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={newAddress.phone} onChange={handleChange} />
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Tỉnh/ Thành Phố" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tỉnh/ Thành Phố</SelectLabel>
                            {provinces.map((province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedProvince}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Quận/ Huyện / Thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Quận/ Huyện / Thành phố</SelectLabel>
                            {districts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ward">Ward</Label>
                      <Select value={selectedWard} onValueChange={handleWardChange} disabled={!selectedDistrict}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Phường / Xã" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Phường / Xã</SelectLabel>
                            {wards.map((ward) => (
                              <SelectItem key={ward} value={ward}>
                                {ward}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={newAddress.address} readOnly />
                  <Label htmlFor="specificAddress">Specific Address</Label>
                  <Input placeholder="Số nhà, đường, ngõ, ..." id="specificAddress" name="specificAddress" value={newAddress.specificAddress} onChange={handleChange} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd}>Add Address</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold my-10">Products Ordered</h2>
          <div className="grid grid-cols-12 gap-4 mb-4 border-b pb-2">
            <label className="col-span-2 font-semibold">Image</label>
            <label className="col-span-2 font-semibold">Product</label>
            <label className="col-span-1 font-semibold">Color</label>
            <label className="col-span-1 font-semibold">Size</label>
            <label className="col-span-1 font-semibold flex justify-center">Unit Price</label>
            <label className="col-span-1 font-semibold flex justify-center">Quantity</label>
            <label className="col-span-1 font-semibold text-right">Total</label>
          </div>
          {products.map((product) => (
            <div key={`${product.productId}-${product.size}`} className="grid grid-cols-12 gap-4 items-center mb-4 border-b pb-2">
              <div className="col-span-2">
                <img src={product.thumbnail} alt={product.productTitle} className="w-16" />
              </div>
              <div className="col-span-2">
                <div className="font-semibold">{product.productTitle || "Product Title"}</div>
              </div>
              <div className="col-span-1">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: product.color }}></div>
              </div>
              <div className="col-span-1">{product.size}</div>
              <div className="col-span-1 flex justify-center">
                <p>{product.price.toLocaleString("en-US")}</p>
              </div>
              <div className="col-span-1 flex justify-center">{product.quantity}</div>
              <div className="col-span-1 text-right">{(product.price * product.quantity).toLocaleString("en-US")}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <div className="w-1/3 flex flex-col">
            <div className="flex justify-between border-t pt-2">
              <span>Merchandise Subtotal</span>
              <span>{subtotal}</span>
            </div>
            <div className="flex justify-between my-2">
              <span>Shipping</span>
              <span>{shipping.toLocaleString("en-US")}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-4">
              <span>Total Payment</span>
              <span>{total}</span>
            </div>
            <Button className="mt-6 w-full" variant="secondary" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
