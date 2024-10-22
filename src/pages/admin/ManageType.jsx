import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableType from "@/components/admin/TableType";
import axios from "axios";

const ManageType = () => {
  const [types, setTypes] = useState([]);
  //get data from api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/type/get-all");

        setTypes(res.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="type">
        <TabsList>
          <TabsTrigger value="type">Types</TabsTrigger>
        </TabsList>
        {/* Type table */}
        <TabsContent value="type">
          <TableType typesData={types} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageType;
