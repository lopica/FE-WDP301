import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import axios from "axios";

const SideBar = ({
  selectedColors,
  setSelectedColors,
  selectedPrices,
  setSelectedPrices,
  setSelectedTypes,
  selectedTypes,
  selectedTags,
  setSelectedTags,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
}) => {
  const colors = ["#ff0000", "#ff5722", "#ffeb3b", "#4caf50", "#2196f3", "#000000", "#795548", "#e91e63", "#cddc39", "#9c27b0", "#00bcd4", "#607d8b"];
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [types, setTypes] = useState([]);

  // fetch data brands, tag, type
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/brand/get-all");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/tag/get-all");
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/type/get-all");
        setTypes(response.data);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchBrands();
    fetchTags();
    fetchTypes();
  }, []);

  const toggleSelection = (item, setSelectedItems, selectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const hotProducts = [
    {
      id: 1,
      name: "Áo Polo Nam Gucci",
      price: 20000,
      image:
        "https://cdn.vuahanghieu.com/unsafe/0x500/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/04/ao-polo-nam-gucci-gg-cotton-jersey-jacquard-polo-shirt-768636-mau-xanh-navy-size-s-6621f01899768-19042024111624.jpg",
    },
    {
      id: 2,
      name: "Áo Thun Run It",
      price: 20000,
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e549908e521545c28aecafc5011a2747_9366/Ao_Thun_Run_It_Be_IJ6833_01_laydown.jpg",
    },
    {
      id: 3,
      name: "Áo Polo Mịn",
      price: 20000,
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/da14fe3ddc0049f9874a58147b5514da_9366/Ao_Polo_Tron_Ultimate365_Mau_xanh_da_troi_IS7346_01_laydown.jpg",
    },
  ];

  return (
    <div>
      <div className="w-64 p-4 border rounded-lg bg-gray-50">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="price">
            <AccordionTrigger className="font-semibold text-gray-700">Price</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center mt-2">
                <input type="number" placeholder="From" className="w-20 mr-2 p-1 border rounded" value={priceRange[0]} onChange={(e) => setPriceRange([e.target.value, priceRange[1]])} />
                <input type="number" placeholder="To" className="w-20 p-1 border rounded" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], e.target.value])} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand">
            <AccordionTrigger className="font-semibold text-gray-700">Brand</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap mt-2">
                {brands.map((brand) => (
                  <button
                    key={brand._id}
                    className={`m-1 px-2 py-1 border rounded hover:bg-gray-200 ${selectedBrands.includes(brand._id) ? "bg-gray-400 text-white" : "bg-white text-gray-700"}`}
                    onClick={() => toggleSelection(brand._id, setSelectedBrands, selectedBrands)}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="type">
            <AccordionTrigger className="font-semibold text-gray-700">Type</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap mt-2">
                {types.map((type) => (
                  <button
                    key={type._id}
                    className={`m-1 px-2 py-1 border rounded hover:bg-gray-200 ${selectedTypes.includes(type._id) ? "bg-gray-400 text-white" : "bg-white text-gray-700"}`}
                    onClick={() => toggleSelection(type._id, setSelectedTypes, selectedTypes)}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tags">
            <AccordionTrigger className="font-semibold text-gray-700">Tags</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap mt-2">
                {tags.map((tag) => (
                  <button
                    key={tag._id}
                    className={`m-1 px-2 py-1 border rounded hover:bg-gray-200 ${selectedTags.includes(tag._id) ? "bg-gray-400 text-white" : "bg-white text-gray-700"}`}
                    onClick={() => toggleSelection(tag._id, setSelectedTags, selectedTags)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Hot Products */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mt-10 ">Hot Products</h3>
        <div className="flex-grow h-px bg-gray-600 "></div>
        <div className="space-y-3 mt-4">
          {hotProducts.map((product) => (
            <div key={product.id} className="flex items-center border p-2 rounded-lg">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded mr-2" />
              <div>
                <h4 className="text-sm font-semibold">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.price.toLocaleString("vi-VN")} đ</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
