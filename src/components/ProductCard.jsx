import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  if (!product) {
    return <div>Loading...</div>;
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-500" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
        ))}
      </>
    );
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 max-w-xs relative">
      <div className="cursor-pointer absolute top-2 right-2 bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded-full shadow flex items-center">
        <FaHeart className="text-red-500 h-7 w-5 opacity-75 hover:opacity-100" />
      </div>
      <Link to={`/product/${product._id}`}>
        <img src={product.thumbnail} alt={product.title} className="w-full h-60 object-cover rounded-t-lg" />
        <div className="p-4">
          <p className="text-gray-700 mb-4">{product.type.name}</p>
          <h3 className="text-lg font-bold text-gray-900 truncate">{product.title}</h3>
          <div className="flex items-center">
            {renderStars(product.rating)}
            <span className="text-gray-600 ml-2">({product.reviews.length} reviews)</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
