import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/App";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { userAuth, setUserAuth } = useContext(UserContext);

  const handleSavePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:9999/api/user/change-password/${userAuth.user.id}`, {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully! ");
      } else if (response.status === 400) {
        toast.error(response.data.message);
      } else {
        toast.error("Failed to change password.");
      }
    } catch (error) {
      toast.error("Wrong current password!");
    }

    // Reset fields after save
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePassword}>Save password</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePassword;
