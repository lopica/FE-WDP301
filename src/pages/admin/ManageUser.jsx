import React, { useState, useEffect } from "react";
import axios from "axios";
import UserTable from "../../components/UserTable";

const ManageUser = () => {
  const [loginTypes, setLoginTypes] = useState([]); // Giả sử bạn có một API để lấy loại đăng nhập nếu cần thiết

  return (
    <div>
      <UserTable />
    </div>
  );
};

export default ManageUser;
