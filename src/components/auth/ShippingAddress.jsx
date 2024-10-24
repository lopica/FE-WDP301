import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "@/App";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import addressData from "../../data/address.js";

const ShippingAddress = () => {
  const { userAuth, setUserAuth } = useContext(UserContext);
  const [addresses, setAddresses] = useState(userAuth.user.shippingAddress || []);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    specificAddress: "",
  });
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
      const response = await axios.delete(`http://localhost:9999/api/user/delete-address/${userAuth.user.id}?addressId=${id}`);

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
      const response = await axios.post(`http://localhost:9999/api/user/add-address/${userAuth.user.id}`, newAddress);

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
      setNewAddress((prevState) => ({
        ...prevState,
        address: `${selectedWard} - ${selectedDistrict} - ${selectedProvince}`,
      }));
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild className="w-auto">
          <Button variant="outline">Add New Address</Button>
        </DialogTrigger>
        <DialogContent className="max-w-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {addresses.map((address) => (
          <div key={address._id} className="bg-white p-4 rounded shadow-md">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Full name: {address.fullName}</h3>
            </div>
            <div className="mb-4">
              <p>
                Phone number: <i>{address.phone}</i>
              </p>
              <p>
                Address: <i>{address.address}</i>
              </p>
              <p>
                Specific Address: <i>{address.specificAddress}</i>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingAddress;
