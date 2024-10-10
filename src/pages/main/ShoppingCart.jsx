import React, { useState } from "react";

const ShoppingCart = ({ cartsData }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Áo Thể Thao Adidas",
      color: "Red",
      size: "L",
      price: 1000000,
      quantity: 1,
      img: "https://hrcwelive.com/wp-content/uploads/2022/11/Merch-Tshirt-Trang-Mat-truoc-800x800-1.jpg",
    },
    {
      id: 2,
      name: "Áo Thể Thao Adidas",
      color: "Red",
      size: "L",
      price: 1000000,
      quantity: 1,
      img: "https://hrcwelive.com/wp-content/uploads/2022/11/Merch-Tshirt-Trang-Mat-truoc-800x800-1.jpg",
    },
  ]);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const couponDiscount = 0;
  const total = subtotal - couponDiscount;

  return (
    <div className="p-6 flex flex-col lg:flex-row justify-between bg-gray-200 min-h-screen">
      <div className="w-full lg:w-2/3 p-4">
        <h2 className="text-2xl font-bold mb-4">Your Cart </h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-4 p-4 bg-white rounded-md shadow-md">
            <div className="flex items-center">
              <img src={item.img} alt={item.name} className="w-20 h-20 object-cover" />
              <div className="ml-4">
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p className="text-gray-500">Size: {item.size}</p>
                <p className="text-gray-500">
                  Color: <span className="inline-block w-4 h-4 bg-red-500 rounded-full"></span>
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <select
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                className="border border-gray-300 rounded-md p-1"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-lg">
                {item.price.toLocaleString()} đ x {item.quantity} = {(item.price * item.quantity).toLocaleString()} đ
              </span>
              <button onClick={() => handleRemove(item.id)} className="ml-4 text-red-500">
                ✖
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full lg:w-1/3 p-4">
        <div className="p-4 bg-white rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4">Order Details</h2>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">Products :</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mb-2">
            <span>Total :</span>
            <span>{subtotal.toLocaleString()} đ</span>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Enter Coupon"
              className="border border-gray-300 rounded-md p-1 mr-2 flex-grow"
            />
            <button className="bg-black text-white py-1 px-3 rounded-md">Submit</button>
          </div>
          <div className="flex justify-between mb-2">
            <span>Coupon :</span>
            <span>{(-couponDiscount).toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total :</span>
            <span>{total.toLocaleString()} đ</span>
          </div>
          <button className="mt-4 w-full bg-black text-white py-2 rounded-md">Go To Payment</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
