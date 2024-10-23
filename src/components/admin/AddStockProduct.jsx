import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AddStockProduct = ({ productDataById }) => {
  const navigate = useNavigate();
  const [newPrice, setNewPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newPrice);
    if (newPrice === "") {
      toast.error("Please enter new price", { duration: 1000 });
      return;
    }
    if (newPrice < 0) {
      toast.error("Price must be greater than 0", { duration: 1000 });
      return;
    }
    const value = newPrice == 0 ? 0 : newPrice;
    try {
      const response = await axios.put(`http://localhost:9999/api/product/update-price/${productDataById._id}`, {
        newPrice: value,
      });
      if (response.status === 200) {
        toast.success("Price updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update price");
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="OldPrice" className="text-right">
            Old Price:
          </Label>
          <Input id="OldPrice" defaultValue={productDataById.price} className="col-span-3" readOnly />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="newPrice" className="text-right">
            New Price:
          </Label>
          <Input
            id="newPrice"
            placeholder="new price: 100000, ... "
            className="col-span-3"
            type="number"
            min="0"
            required
            value={newPrice}
            defaultValue=""
            onChange={(e) => setNewPrice(Number(e.target.value))} // Update state on change
          />
        </div>
      </div>
      <Button onClick={handleSubmit} type="submit">
        Save changes
      </Button>
    </>
  );
};

export default AddStockProduct;
