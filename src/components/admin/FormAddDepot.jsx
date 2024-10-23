import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const colors = [
  { code: "#FF0000", name: "Red" },
  { code: "#008000", name: "Green" },
  { code: "#0000FF", name: "Blue" },
  { code: "#FFFF00", name: "Yellow" },
  { code: "#FFA500", name: "Orange" },
  { code: "#800080", name: "Purple" },
  { code: "#FFC0CB", name: "Pink" },
  { code: "#A52A2A", name: "Brown" },
  { code: "#808080", name: "Grey" },
  { code: "#000000", name: "Black" },
];

const FormAddDepot = ({ productDataById }) => {
  const productId = productDataById._id;
  const [importPrice, setImportPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [importTotal, setImportTotal] = useState(0);
  const [stockDetails, setStockDetails] = useState([{ colorCode: colors[0].code, imageLink: "", details: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 } }]);

  useEffect(() => {
    const price = parseFloat(importPrice) || 0;
    const quantity = parseInt(stock) || 0;
    setImportTotal(price * quantity);
  }, [importPrice, stock]);

  const handleColorChange = (index, newColor) => {
    const updatedStockDetails = [...stockDetails];
    updatedStockDetails[index].colorCode = newColor;
    setStockDetails(updatedStockDetails);
  };

  const handleImageLinkChange = (index, newLink) => {
    const updatedStockDetails = [...stockDetails];
    updatedStockDetails[index].imageLink = newLink;
    setStockDetails(updatedStockDetails);
  };

  const handleSizeChange = (index, size, quantity) => {
    const updatedStockDetails = [...stockDetails];
    updatedStockDetails[index].details[size] = parseInt(quantity) || 0;
    setStockDetails(updatedStockDetails);
  };

  const addColor = () => {
    if (stockDetails.length < 10) {
      setStockDetails([...stockDetails, { colorCode: colors[0].code, imageLink: "", details: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 } }]);
    }
  };

  const removeColor = (index) => {
    if (stockDetails.length > 1) {
      const updatedStockDetails = stockDetails.filter((_, i) => i !== index);
      setStockDetails(updatedStockDetails);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedImportPrice = parseFloat(importPrice);
    const parsedStock = parseInt(stock);

    if (parsedImportPrice <= 0) {
      toast.error("Import price must be greater than 0");
      return;
    }

    const totalStock = stockDetails.reduce((acc, curr) => {
      return acc + Object.values(curr.details).reduce((sum, q) => sum + parseInt(q), 0);
    }, 0);

    if (totalStock !== parsedStock) {
      toast.error("Total stock must be equal to sum of all sizes");
      return;
    }

    const colorCodes = stockDetails.map((detail) => detail.colorCode);
    if (new Set(colorCodes).size !== colorCodes.length) {
      toast.error("Color must be unique");
      return;
    }

    const productData = {
      productId,
      importPrice: parsedImportPrice,
      importTotal,
      stock: parsedStock,
      stockDetails,
    };

    console.log(productData);

    try {
      const response = await axios.post("http://localhost:9999/api/depotProduct/create", productData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Product data submitted successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting product data:", error);
      toast.error("Failed to submit product data");
    }
  };

  return (
    <>
      <div className="flex justify-between border-t-2 border-gray-700 pt-3">
        <div>
          <p>
            <b>Product</b> : <i>{productDataById.title}</i>
          </p>
          <p>
            <b>Stock available</b>: <i>{productDataById.stock}</i>
          </p>
          <p>
            <b>Price</b> : <i>{productDataById.price} vnd</i>
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="border-none mr-20">
                <CircleHelp size={25} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import price : Giá tiền nhập của 1 sản phẩm</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <Label className="mb-2">Import Price:</Label>
          <Input type="number" className="p-2 border border-gray-300 rounded-md" value={importPrice} onChange={(e) => setImportPrice(e.target.value)} required />
        </div>
        <div className="flex flex-col">
          <Label className="mb-2">Total Stock:</Label>
          <Input type="number" className="p-2 border border-gray-300 rounded-md" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
        <div className="flex flex-col">
          <Label className="mb-2">Import Total:</Label>
          <Input type="number" className="p-2 border border-gray-300 rounded-md" value={importTotal} readOnly />
        </div>
        <div className="space-y-4 border-t-2 border-gray-700 pt-5">
          {stockDetails.map((stockDetail, index) => (
            <div key={index} className="border border-gray-300 rounded-md p-4 flex gap-11">
              <div>
                <div className="mb-4">
                  <Label className="mr-6">Color:</Label>
                  <select
                    className="mr-6 focus:outline-none bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow w-1/3"
                    value={stockDetail.colorCode}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                  >
                    {colors.map((color) => (
                      <option key={color.code} value={color.code}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  {stockDetails.length > 1 && (
                    <Button className="bg-red-200" variant="outline" type="button" onClick={() => removeColor(index)}>
                      Remove
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-around mb-4">
                  <Label>Image Link:</Label>
                  <Input type="text" className="p-2 border border-gray-300 rounded-md" value={stockDetail.imageLink} onChange={(e) => handleImageLinkChange(index, e.target.value)} />
                </div>
                <div className="flex space-x-2">
                  {["S", "M", "L", "XL", "2XL"].map((size) => (
                    <div key={size} className="flex flex-col items-center mb-6">
                      <Label className="mb-2">{size}</Label>
                      <Input
                        type="number"
                        className="p-2 border border-gray-300 rounded-md w-20"
                        value={stockDetail.details[size]}
                        onChange={(e) => handleSizeChange(index, size, e.target.value)}
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>{stockDetail.imageLink && <img src={stockDetail.imageLink} alt={`Preview of ${stockDetail.colorCode}`} className="w-fit object-cover border border-gray-300 rounded-md" />}</div>
            </div>
          ))}
        </div>
        {stockDetails.length < 10 && (
          <Button type="button" className="bg-blue-500 text-white rounded-md" onClick={addColor}>
            Add Color
          </Button>
        )}
        <div className="flex justify-end">
          <Button type="submit" className="bg-green-500 text-white rounded-md">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormAddDepot;
