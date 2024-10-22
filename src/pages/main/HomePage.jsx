import React from "react";
import PromoSection from "../../components/PromoSection";
import Banner from "../../components/Banner";
import SaleBanner from "../../components/BannerSale";

import { Link } from "react-router-dom";

// const HomePage = ({ products, brands }) => {
const HomePage = () => {
  // const products = [
  //   {
  //     id: 1,
  //     title: "Adidas Running Shoes",
  //     description: "High-quality running shoes for men with excellent comfort and durability.",
  //     category: "men",
  //     price: 59.99,
  //     discountPercentage: 10,
  //     rating: 4.5,
  //     stock: 20,
  //     type: "Shoes",
  //     tags: ["shoes", "running", "adidas"],
  //     brand: "Adidas",
  //     sku: "AD12345",
  //     weight: 1.2,
  //     dimensions: {
  //       width: 10.5,
  //       height: 4,
  //       depth: 13,
  //     },
  //     warrantyInformation: "6 months warranty",
  //     shippingInformation: "Ships within 3-5 business days",
  //     availabilityStatus: "In Stock",
  //     reviews: [
  //       {
  //         rating: 5,
  //         comment: "Great shoes! Very comfortable.",
  //         date: "2024-05-23T08:56:21.618Z",
  //         reviewerName: "John Smith",
  //         reviewerEmail: "john.smith@example.com",
  //       },
  //       {
  //         rating: 4,
  //         comment: "Good quality, but a bit pricey.",
  //         date: "2024-05-23T08:56:21.618Z",
  //         reviewerName: "Jane Doe",
  //         reviewerEmail: "jane.doe@example.com",
  //       },
  //     ],
  //     returnPolicy: "30 days return policy",
  //     minimumOrderQuantity: 1,
  //     meta: {
  //       createdAt: "2024-05-23T08:56:21.618Z",
  //       updatedAt: "2024-05-23T08:56:21.618Z",
  //       barcode: "1234567890123",
  //       qrCode: "",
  //     },
  //     images: ["https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvi9fsmkceq521", "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvi9fsmk3zbhf4"],
  //     thumbnail: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvi9fsmkceq521",
  //     stockDetails: {
  //       "#ff0000": {
  //         L: 3,
  //         M: 2,
  //         XL: 5,
  //       },
  //       "#50d71e": {
  //         S: 2,
  //         L: 1,
  //         XL: 3,
  //         "2XL": 4,
  //       },
  //     },
  //   },
  //   {
  //     id: 2,
  //     title: "Nike Sports Jacket",
  //     description: "Stylish sports jacket for women, perfect for outdoor activities.",
  //     category: "women",
  //     price: 89.99,
  //     discountPercentage: 15,
  //     rating: 4.7,
  //     stock: 15,
  //     type: "T-Shirt",
  //     tags: ["jacket", "sports", "nike"],
  //     brand: "Nike",
  //     sku: "NK54321",
  //     weight: 0.8,
  //     createdAt: "2024-05-23T08:56:21.618Z",
  //     dimensions: {
  //       width: 15,
  //       height: 2,
  //       depth: 18,
  //     },
  //     warrantyInformation: "1 year warranty",
  //     shippingInformation: "Ships within 3-5 business days",
  //     availabilityStatus: "In Stock",
  //     reviews: [
  //       {
  //         rating: 5,
  //         comment: "Love this jacket! Keeps me warm during my runs.",
  //         date: "2024-05-23T08:56:21.618Z",
  //         reviewerName: "Alice Johnson",
  //         reviewerEmail: "alice.johnson@example.com",
  //       },
  //       {
  //         rating: 4,
  //         comment: "Good quality, but could be more water-resistant.",
  //         date: "2024-05-23T08:56:21.618Z",
  //         reviewerName: "Bob Brown",
  //         reviewerEmail: "bob.brown@example.com",
  //       },
  //     ],
  //     returnPolicy: "30 days return policy",
  //     minimumOrderQuantity: 1,
  //     meta: {
  //       createdAt: "2024-05-23T08:56:21.618Z",
  //       updatedAt: "2024-05-23T08:56:21.618Z",
  //       barcode: "9876543210987",
  //       qrCode: "",
  //     },
  //     images: [""],
  //     thumbnail: "",
  //     stockDetails: {
  //       "#000000": {
  //         M: 5,
  //         L: 5,
  //         XL: 5,
  //       },
  //       "#ffffff": {
  //         S: 2,
  //         M: 3,
  //         L: 4,
  //         XL: 1,
  //       },
  //     },
  //   },
  //   {
  //     id: 3,
  //     title: "Puma T-Shirt",
  //     description: "Comfortable and stylish t-shirt for men, suitable for casual wear.",
  //     category: "men",
  //     price: 29.99,
  //     discountPercentage: 5,
  //     rating: 4.3,
  //     stock: 25,
  //     type: "T-Shirt",
  //     tags: ["t-shirt", "casual", "puma"],
  //     brand: "Puma",
  //     sku: "PM67890",
  //     weight: 0.3,
  //     createdAt: "2024-05-23T08:56:21.618Z",
  //     dimensions: {
  //       width: 12,
  //       height: 1,
  //       depth: 14,
  //     },
  //     warrantyInformation: "6 months warranty",
  //     shippingInformation: "Ships within 3-5 business days",
  //     availabilityStatus: "In Stock",
  //     reviews: [
  //       {
  //         rating: 4,
  //         comment: "Nice t-shirt, fits well.",
  //         date: "2024-05-23T08:56:21.618Z",
  //         reviewerName: "Chris Evans",
  //         reviewerEmail: "chris.evans@example.com",
  //       },
  //       {
  //         rating: 5,
  //         comment: "Great quality and very comfortable.",
  //         date: "2024-05-23T08:56:21.618Z",
  //         reviewerName: "Sarah Lee",
  //         reviewerEmail: "sarah.lee@example.com",
  //       },
  //     ],
  //     returnPolicy: "30 days return policy",
  //     minimumOrderQuantity: 1,
  //     meta: {
  //       createdAt: "2024-05-23T08:56:21.618Z",
  //       updatedAt: "2024-05-23T08:56:21.618Z",
  //       barcode: "1230984567654",
  //       qrCode: "",
  //     },
  //     images: [""],
  //     thumbnail: "",
  //     stockDetails: {
  //       "#0000ff": {
  //         S: 2,
  //         M: 3,
  //         L: 4,
  //         XL: 1,
  //       },
  //       "#50d71e": {
  //         S: 2,
  //         M: 3,
  //         L: 4,
  //         XL: 1,
  //       },
  //     },
  //   },
  //   {
  //     id: 4,
  //     title: "Reebok Training Pants",
  //     description: "Durable and flexible training pants for women, ideal for workouts.",
  //     category: "women",
  //     price: 49.99,
  //     discountPercentage: 12,
  //     rating: 4.6,
  //     stock: 30,
  //     type: "Pant",
  //     tags: ["pants", "training", "reebok"],
  //     brand: "Reebok",
  //     sku: "RB12345",
  //     weight: 0.5,
  //     createdAt: "2024-05-23T08:56:21.618Z",
  //     dimensions: {
  //       width: 14,
  //       height: 1.5,
  //       depth: 16,
  //     },
  //     warrantyInformation: "1 year warranty",
  //     shippingInformation: "Ships within 3-5 business days",
  //     availabilityStatus: "In Stock",
  //     reviews: [
  //       {
  //         rating: 5,
  //         comment: "Excellent training pants, very comfortable.",
  //         date: "2024-05-23T08:56:21.618Z",
  //         reviewerName: "Emma Watson",
  //         reviewerEmail: "emma.watson@example.com",
  //       },
  //       {
  //         rating: 4,
  //         comment: "Good quality, but a bit tight.",
  //         date: "2024-05-23T08:56:21.618Z",
  //         reviewerName: "Daniel Craig",
  //         reviewerEmail: "daniel.craig@example.com",
  //       },
  //     ],
  //     returnPolicy: "30 days return policy",
  //     minimumOrderQuantity: 1,
  //     meta: {
  //       createdAt: "2024-05-23T08:56:21.618Z",
  //       updatedAt: "2024-05-23T08:56:21.618Z",
  //       barcode: "9087654321098",
  //       qrCode: "",
  //     },
  //     images: [""],
  //     thumbnail: "",
  //     stockDetails: {
  //       "#000000": {
  //         M: 10,
  //         L: 5,
  //         XL: 10,
  //         "2XL": 5,
  //       },
  //       "#808080": {
  //         M: 5,
  //         L: 5,
  //         XL: 5,
  //         "2XL": 5,
  //       },
  //     },
  //   },
  // ];
  // const brands = [
  //   {
  //     id: 1,
  //     name: "Adidas",
  //     description: "Sportswear and athletic shoes",
  //     image: "",
  //   },
  //   {
  //     id: 2,
  //     name: "Apple",
  //     description: "Consumer electronics and software",
  //     image: "",
  //   },
  //   {
  //     id: 3,
  //     name: "Samsung",
  //     description: "Consumer electronics and appliances",
  //     image: "",
  //   },
  // ];

  return (
    <div>
      <PromoSection />
      <Banner />
      <SaleBanner />
      {/* Brands list */}
      {/* <div className="bg-gray-200 min-h-screen p-8"> */}
      {/* <section className="mb-8">
          <h2 className="text-3xl font-bold mb-10 flex justify-center">Brands</h2>
          <div className="flex space-x-4 justify-center">
            {brands.map((brand) => (
              <div key={brand.id} className="flex-shrink-0 w-32 h-56 bg-gray-800 rounded-lg flex items-center justify-center">
                <img src={brand.image} alt="Category" className="w-16 h-16" />
              </div>
            ))}
          </div>
        </section> */}

      {/* Trending products */}
      {/* <section>
          <h2 className="text-3xl font-bold mb-4">Trending Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                <Link to={`/product/${product.id}`}>
                  <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover" />
                </Link>
                <h3 className="mt-2 text-gray-900 text-sm">{product.title}</h3>
                <p className="mt-1 text-gray-600">{`$${product.price.toFixed(2)}`}</p>
              </div>
            ))}
          </div>
        </section> */}
      {/* </div> */}
    </div>
  );
};

export default HomePage;
