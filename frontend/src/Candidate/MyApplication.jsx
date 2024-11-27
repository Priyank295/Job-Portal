import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const MyApplication = () => {
  const [applications, setApplications] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/usr/getApplicationStatus",
            {},
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          setApplications(response.data.applications);
        } catch (error) {
          toast({
            title: "Error fetching applications",
            description:
              error.response?.data ||
              "An error occurred while fetching applications.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "No token provided",
          description: "Please log in to view applications.",
          variant: "destructive",
        });
      }
    };

    fetchApplications();
  }, [toast]);

  return (
    <div className="p-4">
      {applications.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg font-medium">
            You have not applied for any jobs
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <Card key={application.jobId} className="w-full">
              <CardHeader>
                <CardTitle>{application.jobTitle}</CardTitle>
                <CardDescription>
                  Status: {application.jobStatus}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge
                    variant={
                      application.applicationStatus === "Accepted"
                        ? "success"
                        : application.applicationStatus === "Rejected"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {application.applicationStatus}
                  </Badge>
                  <p>
                    Applied At:{" "}
                    {new Date(application.appliedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      ;
    </div>
  );
};

export default MyApplication;
