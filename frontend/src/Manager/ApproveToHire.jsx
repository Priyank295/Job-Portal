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
import axiosInstance from "../axiosInstance";

const ApproveToHire = () => {
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchApprovedApplications = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/hiringManager/getApprovedApplications",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setApprovedApplications(response.data.approvedApplications);
      } catch (error) {
        toast({
          title: "Error fetching approved applications",
          description:
            error.response?.data ||
            "An error occurred while fetching approved applications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to view approved applications.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, [toast]);

  const handleHire = async (jobId, candidateId) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          `/hiringManager/${jobId}/hire/${candidateId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast({
          title: "Candidate hired",
          description: response.data.message,
        });

        fetchApprovedApplications();
      } catch (error) {
        toast({
          title: "Error hiring candidate",
          description:
            error.response?.data ||
            "An error occurred while hiring the candidate.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to hire candidates.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (jobId, candidateId) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          `/hiringManager/reject-hiring/${jobId}/${candidateId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast({
          title: "Candidate rejected",
          description: response.data.message,
        });

        // Refetch the approved applications to update the list
        fetchApprovedApplications();
      } catch (error) {
        toast({
          title: "Error rejecting candidate",
          description:
            error.response?.data ||
            "An error occurred while rejecting the candidate.",
          variant: "destructive",
        });
      } finally {
        setLoading(true);
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to reject candidates.",
        variant: "destructive",
      });
    }
  };

  const handleAction = () => {
    if (actionType === "hire") {
      handleHire(selectedApplication.jobId, selectedApplication.candidateId);
    } else if (actionType === "reject") {
      handleReject(selectedApplication.jobId, selectedApplication.candidateId);
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="flex flex-col items-center space-y-4">
            {" "}
            <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />{" "}
            <p className="text-gray-500 dark:text-gray-400">Please wait...</p>{" "}
          </div>
        </div>
      ) : approvedApplications.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg font-medium">
            No candidates are there for hiring approval
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedApplications.map((job) =>
            job.approvedApplications.length === 0 ? (
              <div className="col-span-full text-center text-lg font-medium">
                No candidates are there for hiring approval
              </div>
            ) : (
              job.approvedApplications.map((application) => (
                <Card key={application.candidateId} className="w-full">
                  <CardHeader>
                    <CardTitle>{application.candidateName}</CardTitle>
                    <CardDescription>{job.jobTitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={application.candidateEmail} readOnly />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedApplication({
                              jobId: job.jobId,
                              candidateId: application.candidateId,
                            });
                            setActionType("reject");
                          }}
                        >
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to reject this candidate?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. You will be rejecting
                            the candidate "{application.candidateName}".
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
                            setSelectedApplication({
                              jobId: job.jobId,
                              candidateId: application.candidateId,
                            });
                            setActionType("hire");
                          }}
                        >
                          Hire
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to hire this candidate?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. You will be hiring the
                            candidate "{application.candidateName}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleAction}>
                            Hire
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ApproveToHire;
