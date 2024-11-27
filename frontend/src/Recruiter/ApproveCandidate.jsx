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

const ApproveCandidate = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [data, setData] = useState([]);
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();

  const fetchApplications = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/recruiter/getAllJobApplications",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setApplications(response.data.allApplications);

        setData(
          applications.map((job) =>
            job.applications.filter(
              (application) => application.applicationStatus === "Pending"
            )
          )
        );
        console.log(data);

        // console.log(response.data.allApplications);
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

  useEffect(() => {
    fetchApplications();
  }, [toast]);

  const handleAccept = async (jobId, candidateId) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/recruiter/${jobId}/approve/${candidateId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast({
          title: "Candidate approved",
          description: response.data.message,
        });

        // Refetch the applications to update the list
        fetchApplications();
      } catch (error) {
        toast({
          title: "Error approving candidate",
          description:
            error.response?.data ||
            "An error occurred while approving the candidate.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to approve candidates.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (jobId, candidateId) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/recruiter/reject-application/${jobId}/${candidateId}`,
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

        // Refetch the applications to update the list
        fetchApplications();
      } catch (error) {
        toast({
          title: "Error rejecting candidate",
          description:
            error.response?.data ||
            "An error occurred while rejecting the candidate.",
          variant: "destructive",
        });
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
    if (actionType === "accept") {
      handleAccept(selectedApplication.jobId, selectedApplication.candidateId);
    } else if (actionType === "reject") {
      handleReject(selectedApplication.jobId, selectedApplication.candidateId);
    }
  };

  return (
    <div className=" p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.length === 0 ? (
        <div className="col-span-full text-center text-lg font-medium">
          No applications are there
        </div>
      ) : (
        applications.map((job) =>
          job.applications
            .filter(
              (application) => application.applicationStatus === "Pending"
            )
            .map((application) => (
              <Card key={application.candidateId} className="w-full">
                <CardHeader>
                  <CardTitle>{application.candidateName}</CardTitle>
                  <CardDescription>{job.jobTitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={application.candidateEmail} readOnly />
                    <Label>Status</Label>
                    <Input value={application.applicationStatus} readOnly />
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
                          setActionType("accept");
                        }}
                      >
                        Accept
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to accept this candidate?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. You will be accepting
                          the candidate "{application.candidateName}".
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
            ))
        )
      )}
    </div>
  );
};

export default ApproveCandidate;
