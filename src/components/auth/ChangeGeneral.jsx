import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserContext } from "@/App";

const ChangeGeneral = () => {
  const { userAuth, setUserAuth } = useContext(UserContext);
  const [name, setFullName] = useState(userAuth?.user?.name || "");
  const [email, setEmail] = useState(userAuth?.user?.email || "");
  const [phone, setPhone] = useState(userAuth?.user?.phone || "");
  const [gender, setGender] = useState(userAuth?.user?.gender || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email cannot be empty!");
      return;
    }

    const updatedUser = { name, email, phone, gender };

    try {
      const response = await axios.put(`http://localhost:9999/api/user/update-general-user/${userAuth.user.id}`, updatedUser);

      if (response.status === 201) {
        sessionStorage.setItem("user", JSON.stringify(response.data));
        setUserAuth({ ...userAuth, user: response.data });
        toast.success("Updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update user!");
      }
    } catch (error) {
      toast.error("Error updating user!");
    }
  };

  const handleCancel = () => {
    setFullName(userAuth?.user?.name || "");
    setEmail(userAuth?.user?.email || "");
    setPhone(userAuth?.user?.phone || "");
    setGender(userAuth?.user?.gender || "");
    setIsEditing(false);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Change your information here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" value={name} onChange={(e) => setFullName(e.target.value)} disabled={!isEditing} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={(value) => setGender(value)} disabled={!isEditing}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Gender</SelectLabel>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other...</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={handleCancel} variant="secondary">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangeGeneral;
