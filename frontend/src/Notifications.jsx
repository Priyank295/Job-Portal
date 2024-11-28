import React, { useEffect, useState } from "react";
import axios from "axios";
import { BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "./axiosInstance";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const response = await axiosInstance.get("/usr/inbox", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setNotifications(response.data.notifications);
        } catch (error) {
          toast({
            title: "Error fetching notifications",
            description:
              error.response?.data ||
              "An error occurred while fetching notifications.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "No token provided",
          description: "Please log in to view notifications.",
          variant: "destructive",
        });
      }
    };

    fetchNotifications();
  }, [toast]);

  return (
    <div className="p-4">
      <Card className={cn("w-full md:w-[380px]")}>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            You have {notifications.length} unread messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification._id}
              className="flex items-center space-x-4 rounded-md border p-4"
            >
              <BellRing />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.message}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.isRead ? "Read" : "Unread"}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
