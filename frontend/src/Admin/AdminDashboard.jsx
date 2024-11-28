"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "../axiosInstance";

const roles = [
  { value: "Candidate", label: "Candidate" },
  { value: "Recruiter", label: "Recruiter" },
  { value: "Hiring_Manager", label: "Hiring Manager" },
  { value: "Employee", label: "Employee" },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const response = await axiosInstance.get("/admin/getUsers", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          const allUsers = [
            ...response.data.users.Candidate,
            ...response.data.users.Hiring_Manager,
            ...response.data.users.Recruiter,
          ];
          setUsers(allUsers);
          toast({
            title: "Users retrieved successfully",
            description: response.data.message,
          });
        } catch (error) {
          toast({
            title: "Error fetching users",
            description:
              error.response?.data || "An error occurred while fetching users.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "No token provided",
          description: "Please log in to view users.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [toast]);

  const handleRoleChange = async (userId, newRole) => {
    console.log(`Changing role of user with id: ${userId} to ${newRole}`);
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axiosInstance.put(
          `/admin/changeUserRole/${userId}`,
          { role: newRole },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast({
          title: "Role updated",
          description: response.data.message,
        });

        // Update the user's role in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } catch (error) {
        console.log(error);
        toast({
          title: "Error updating role",
          description:
            error.response?.data ||
            "An error occurred while updating the role.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to change roles.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="w-full">
          <CardHeader>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Role</Label>
              <RoleSelect
                currentRole={user.role}
                onRoleChange={(newRole) => handleRoleChange(user.id, newRole)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const RoleSelect = ({ currentRole, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const handleSave = () => {
    onRoleChange(selectedRole);
  };

  return (
    <div>
      <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Roles</SelectLabel>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={handleSave} className="mt-2">
        Save
      </Button>
    </div>
  );
};

export default AdminDashboard;
