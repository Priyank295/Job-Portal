import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const { toast } = useToast();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
      if (storedToken) {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/usr/jobs",
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

    fetchJobs();
  }, [toast]);

  const handleApply = async (jobId) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/usr/apply/${jobId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast({
          title: "Application successful",
          description: response.data.message,
        });
      } catch (error) {
        toast({
          title: "Error applying for job",
          description:
            error.response?.data ||
            "An error occurred while applying for the job.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No token provided",
        description: "Please log in to apply for jobs.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs
        .filter((job) => job.status === "Approved")
        .map((job) => (
          <Card key={job._id} className="w-full">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Location: {job.location}</p>
                <p>Status: {job.status}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p>Posted by: {job.recruiter.username}</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {role === "Candidate" ? (
                    <Button onClick={() => setSelectedJobId(job._id)}>
                      Apply
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to apply?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. You will be applying for the
                      job "{job.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleApply(selectedJobId)}
                    >
                      Apply
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default Jobs;
