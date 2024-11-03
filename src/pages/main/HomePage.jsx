import React from "react";
import PromoSection from "../../components/PromoSection";
import Banner from "../../components/Banner";
import SaleBanner from "../../components/BannerSale";

import { Link } from "react-router-dom";

// const HomePage = ({ products, brands }) => {
const HomePage = () => {
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
