import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const { userAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const shippingRate = 35000; // Shipping rate in VND
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = userAuth?.user?.id;
        if (!userId) {
          toast.error("Please login to view your cart.");
          navigate("/login");
          return;
        }
        const response = await axios.get(`http://localhost:9999/api/cart/get-cart-by-user-id/${userId}`);
        setProducts(response.data.cartItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        toast.error("An error occurred while fetching the cart data.");
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [userAuth, navigate]);

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) quantity = 1;
    const updatedProducts = products.map((product) => (product.productId === productId && product.size === size ? { ...product, quantity: quantity } : product));
    setProducts(updatedProducts);

    const updatedSelectedProducts = selectedProducts.map((product) => (product.productId === productId && product.size === size ? { ...product, quantity: quantity } : product));
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleQuantityChange = (productId, size, value) => {
    const quantity = value === "" ? 1 : parseInt(value, 10);
    updateQuantity(productId, size, quantity);
  };

  const removeItem = async (productId, color, size) => {
    const userId = userAuth?.user?.id;
    try {
      await axios.post(`http://localhost:9999/api/cart/remove-item`, {
        userId,
        productId,
        color,
        size,
      });
      setProducts((prev) => prev.filter((product) => !(product.productId === productId && product.size === size)));
      setSelectedProducts((prev) => prev.filter((product) => !(product.productId === productId && product.size === size)));
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("An error occurred while removing the item from cart.");
    }
  };

  const handleCheckboxChange = (productId, size) => {
    const productIndex = selectedProducts.findIndex((product) => product.productId === productId && product.size === size);
    if (productIndex > -1) {
      setSelectedProducts((prev) => prev.filter((product) => !(product.productId === productId && product.size === size)));
    } else {
      const product = products.find((product) => product.productId === productId && product.size === size);
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0).toLocaleString("en-US");
  };

  const calculateTotal = (subtotal) => {
    const subtotalNumber = parseFloat(subtotal.replace(/,/g, ""));
    return (subtotalNumber + shippingRate).toLocaleString("en-US");
  };

  const subtotal = calculateSubtotal();
  const total = calculateTotal(subtotal);

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        products: selectedProducts,
        subtotal,
        shipping: shippingRate,
        total,
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-semibold">Shopping Cart</h1>
        <div className="p-4 mt-6 text-center">
          <p>Your cart is empty.</p>
          <Button variant="outline" className="mt-4 bg-blue-100 w-40" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-semibold">Shopping Cart</h1>
      <div className="p-4 mt-6">
        <div className="grid grid-cols-12 gap-4 mb-4 border-b pb-2">
          <label className="col-span-1">Select</label>
          <label className="col-span-2">Image</label>
          <label className="col-span-2">Product</label>
          <label className="col-span-1">Color</label>
          <label className="col-span-1">Size</label>
          <label className="col-span-2">Price</label>
          <label className="col-span-1">Quantity</label>
          <label className="col-span-1">Remove</label>
          <label className="col-span-1 text-right">Total</label>
        </div>
        {products.map((product) => (
          <div key={`${product.productId}-${product.size}`} className="grid grid-cols-12 gap-4 items-center mb-4 border-b pb-2">
            {/* Select */}
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedProducts.some((selectedProduct) => selectedProduct.productId === product.productId && selectedProduct.size === product.size)}
                onChange={() => handleCheckboxChange(product.productId, product.size)}
              />
            </div>
            {/* Image */}
            <div className="col-span-2">
              <img src={product.thumbnail} alt={product.productTitle} className="w-16" />
            </div>
            {/* Product Title */}
            <div className="col-span-2">
              <div className="font-semibold">{product.productTitle || "Product Title"}</div>
            </div>
            {/* Color */}
            <div className="col-span-1">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: product.color }}></div>
            </div>
            {/* Size */}
            <div className="col-span-1">{product.size}</div>
            {/* Price */}
            <div className="col-span-2">{product.price.toLocaleString("en-US")}</div>
            {/* Quantity */}
            <div className="col-span-1">
              <input type="number" value={product.quantity} min="1" onChange={(e) => handleQuantityChange(product.productId, product.size, e.target.value)} className="w-16 border rounded p-1" />
            </div>
            {/* Remove */}
            <div className="col-span-1">
              <Button variant="outline" onClick={() => removeItem(product.productId, product.color, product.size)}>
                Remove
              </Button>
            </div>
            {/* Total */}
            <div className="col-span-1 text-right">{(product.price * product.quantity).toLocaleString("en-US")}</div>
          </div>
        ))}
        <div className="flex justify-end">
          <div className="mt-6 w-1/3">
            <div className="flex justify-between border-t pt-2">
              <span>Subtotal</span>
              <span>{subtotal}</span>
            </div>
            <div className="flex justify-between my-2">
              <span>Shipping</span>
              <span>{shippingRate.toLocaleString("en-US")}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-4">
              <span>Grand Total</span>
              <span>{total}</span>
            </div>
            <Button className="mt-8 w-full" onClick={handleCheckout} disabled={selectedProducts.length === 0}>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
