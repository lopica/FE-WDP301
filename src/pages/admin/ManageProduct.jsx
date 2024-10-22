import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableDepot from "../../components/admin/TableDepot";
import TableProduct from "../../components/admin/TableProduct";
import axios from "axios";

const ManageProduct = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [depotData, setDepotData] = useState([]);
  const [tags, setTags] = useState([]);

  //get data from api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCategory = await axios.get("http://localhost:9999/api/category/get-all");
        const resProduct = await axios.get("http://localhost:9999/api/product/get-all-product");
        const resProductDepot = await axios.get("http://localhost:9999/api/depotProduct/get-all-product");
        const resTag = await axios.get("http://localhost:9999/api/tag/get-all");
        const myProduct = resProduct.data.products;
        const myCategory = resCategory.data;
        const myProductDepot = resProductDepot.data.productDepots;
        setDepotData(myProductDepot);
        setCategories(myCategory);
        setProducts(myProduct);
        setTags(resTag.data);
        // console.log(myProductDepot);
        // console.log(myCategory);
        // console.log(resTag.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="product">
        <TabsList>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="depot">Depot History</TabsTrigger>
        </TabsList>
        {/* product table */}
        <TabsContent value="product">
          <TableProduct productData={products} categories={categories} tags={tags} />
        </TabsContent>
        {/* product depot table */}
        <TabsContent value="depot">
          <TableDepot depotData={depotData} productData={products} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageProduct;
