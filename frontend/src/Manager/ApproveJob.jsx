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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ApproveJob = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();

  const fetchJobs = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/hiringManager/pendingJobs",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setJobs(response.data.jobs);
      } catch (error) {
        toast({
          title: "Error fetching jobs",
          description:
            error.response?.data || "An error occurred while fetching jobs.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to view jobs.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [toast]);

  const handleAccept = async (id) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/hiringManager/approveJob/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast({
          title: "Job approved",
          description: response.data.message,
        });

        // Refetch the pending jobs
        fetchJobs();
      } catch (error) {
        toast({
          title: "Error approving job",
          description:
            error.response?.data ||
            "An error occurred while approving the job.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to approve jobs.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/hiringManager/reject-job/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast({
          title: "Job rejected",
          description: response.data.message,
        });

        // Refetch the pending jobs
        fetchJobs();
      } catch (error) {
        toast({
          title: "Error rejecting job",
          description:
            error.response?.data ||
            "An error occurred while rejecting the job.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to reject jobs.",
        variant: "destructive",
      });
    }
  };

  const handleAction = () => {
    if (actionType === "accept") {
      handleAccept(selectedJobId);
    } else if (actionType === "reject") {
      handleReject(selectedJobId);
    }
  };

  return (
    <div className="p-4">
      {jobs.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg font-medium">
            No jobs are pending for approval
          </p>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card key={job._id} className="w-full">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.recruiter.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={job.location} readOnly />
                  <Label>Description</Label>
                  <Input value={job.description} readOnly />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedJobId(job._id);
                        setActionType("reject");
                      }}
                    >
                      Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to reject this job?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. You will be rejecting the
                        job "{job.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAction}>
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedJobId(job._id);
                        setActionType("accept");
                      }}
                    >
                      Accept
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to accept this job?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. You will be accepting the
                        job "{job.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAction}>
                        Accept
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveJob;
