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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          setLoading(true);
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
        } finally {
          setLoading(false);
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
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col items-center space-y-4">
                {" "}
                <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />{" "}
                <p className="text-gray-500 dark:text-gray-400">
                  Please wait...
                </p>{" "}
              </div>
            </div>
          ) : (
            notifications.slice(0, 3).map((notification) => (
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
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
