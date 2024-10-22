import { useState, useEffect } from "react";
import axios from "axios";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export default function ManageUserDetail() {
  const [user, setUser] = useState({
    name: "",
    role: "",
    refreshToken: "",
    email: "",
    shippingAddress: [],
  });
  const navigate = useNavigate();
  const goBack = () => {
    navigate(`/admin/users`);
  };
  const { id } = useParams("id");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/user/detail/${id}`);
        const data = response.data;
        setUser({
          name: data.name,
          role: data.role.name,
          refreshToken: data.refreshToken == null ? "X" : data.refreshToken,
          email: data.email,
          shippingAddress: data.shippingAddress,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="sm:col-span-4">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Name
            </label>
            <div className="mt-2">
              <input
                readOnly
                id="name"
                name="name"
                type="text"
                value={user.name}
                onChange={handleChange}
                autoComplete="name"
                className="block w-full pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="sm:col-span-4">
            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
              Role
            </label>
            <div className="mt-2">
              <input
                readOnly
                id="role"
                name="role"
                type="text"
                value={user.role}
                onChange={handleChange}
                autoComplete="role"
                className="block w-full  pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="sm:col-span-4">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                readOnly
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                autoComplete="email"
                className="block w-full  pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="sm:col-span-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Shipping Addresses</label>
            {user.shippingAddress && user.shippingAddress.length > 0 ? (
              user.shippingAddress.map((address, index) => (
                <div key={index} className="mt-2 flex items-center">
                  <input
                    readOnly
                    type="text"
                    value={address.address}
                    onChange={(e) => handleShippingAddressChange(index, e)}
                    className="block w-full pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              ))
            ) : (
              <p>Người dùng chưa add địa chỉ</p>
            )}
          </div>{" "}
        </CardContent>

        <CardFooter>
          <p>
            {" "}
            <button type="button" onClick={goBack} className="text-sm font-semibold leading-6 text-gray-900 bg-white hover:bg-gray-50 py-1 px-2 border border-gray-200 rounded shadow">
              Back
            </button>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
