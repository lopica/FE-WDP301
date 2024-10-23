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
  // const brands = ["Adidas", "Nike", "Puma", "Gucci", "Dior", "Fila", "Vans", "Uniqlo", "Lacoste"];
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

  return (
    <div className="w-64 p-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="mb-4">
              <input type="number" placeholder="From" className="w-20 mr-2 p-1 border rounded" value={priceRange[0]} onChange={(e) => setPriceRange([e.target.value, priceRange[1]])} />
              <input type="number" placeholder="To" className="w-20 p-1 border rounded" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], e.target.value])} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap">
              {brands.map((brand) => (
                <button
                  key={brand._id}
                  className={`m-1 px-2 py-1 border rounded ${selectedBrands.includes(brand._id) ? "bg-gray-400" : "bg-white"}`}
                  onClick={() => toggleSelection(brand._id, setSelectedBrands, selectedBrands)}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger>Type</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap">
              {types.map((type) => (
                <button
                  key={type._id}
                  className={`m-1 px-2 py-1 border rounded ${selectedTypes.includes(type._id) ? "bg-gray-400" : "bg-white"}`}
                  onClick={() => toggleSelection(type._id, setSelectedTypes, selectedTypes)}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  className={`m-1 px-2 py-1 border rounded ${selectedTags.includes(tag._id) ? "bg-gray-400" : "bg-white"}`}
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
  );
};

export default SideBar;
