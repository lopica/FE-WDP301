import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import Sidebar from "../../components/SideBar";
import axios from "axios";

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]); // Ensure this is initialized as an array
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/category/get-all");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when category or categories change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        const lowerCaseCategory = category?.toLowerCase();
        if (lowerCaseCategory === "all") {
          response = await axios.get(`http://localhost:9999/api/product/get-all-product2`);
          // console.log(response.data);
        } else {
          const categoryObj = categories.find((cat) => cat.name.toLowerCase() === lowerCaseCategory);
          if (categoryObj) {
            response = await axios.get(`http://localhost:9999/api/product/get-product-by-category-id/${categoryObj._id}`);
          } else {
            response = await axios.get(`http://localhost:9999/api/product/get-all-product2`);
          }
        }
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [category, categories]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortProducts = (products) => {
    switch (sortOption) {
      case "price-high-low":
        return products.sort((a, b) => b.price - a.price);
      case "price-low-high":
        return products.sort((a, b) => a.price - b.price);
      case "newest":
        return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return products;
    }
  };

  const filteredProducts = products.filter((product) => {
    // const matchesCategory = product.category?.name?.toLowerCase() === category?.toLowerCase();
    const matchesColor = selectedColors.length === 0 || selectedColors.some((color) => product.stockDetails.some((detail) => detail.colorCode === color));
    const matchesPrice = product.price >= selectedPrices[0] && product.price <= selectedPrices[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesTag = selectedTags.length === 0 || selectedTags.includes(product.tag);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
    const matchesSearchQuery = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = product.availabilityStatus?.toLowerCase() === "in stock";
    return matchesColor && matchesPrice && matchesBrand && matchesType && matchesTag && matchesSearchQuery && matchesStatus;
  });

  const sortedProducts = sortProducts(filteredProducts);

  return (
    <div>
      <div className="container mx-auto p-6 flex">
        <div className={`transition-transform duration-300 ease-in-out ${showSidebar ? "w-64" : "w-0"} overflow-hidden`}>
          <Sidebar
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            priceRange={selectedPrices}
            setPriceRange={setSelectedPrices}
          />
        </div>
        <div className="flex-1 ml-4">
          <div className="flex justify-between items-center mb-4">
            <button onClick={toggleSidebar} className="bg-gray-200 p-2 rounded">
              {showSidebar ? "Hide Filters" : "Show Filters"}
            </button>
            <div className="relative">
              <select value={sortOption} onChange={handleSortChange} className="bg-gray-200 p-2 rounded">
                <option value="newest">Newest</option>
                <option value="price-high-low">Price: High-Low</option>
                <option value="price-low-high">Price: Low-High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4 w-1/4">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by product title" className="bg-gray-200 p-2 rounded w-full" />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {category.charAt(0).toUpperCase() + category.slice(1)} Products ({filteredProducts.length})
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
