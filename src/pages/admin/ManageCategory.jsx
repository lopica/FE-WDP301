import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableCategory from "@/components/admin/TableCategory";
import axios from "axios";

const ManageCategory = () => {
  const [tags, setTags] = useState([]);
  //get data from api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/category/get-all");
        setTags(res.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="tag">
        <TabsList>
          <TabsTrigger value="tag">Tags</TabsTrigger>
        </TabsList>
        {/* tag table */}
        <TabsContent value="tag">
          <TableCategory tagsData={tags} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageCategory;
