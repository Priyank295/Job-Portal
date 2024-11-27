"use client";

import { useState, useTransition } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Loader2 } from "lucide-react";
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

const CreateJob = () => {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/recruiter/create-job",
        {
          title: form.jobTitle,
          company: form.company,
          location: form.location,
          description: form.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        position: "bottom-left",
        title: "Job created",
        description: response.data.message,
      });

      setForm({
        jobTitle: "",
        company: "",
        location: "",
        description: "",
      });
    } catch (err) {
      toast({
        position: "bottom-left",
        title: "Something went wrong",
        description:
          err.response?.data ||
          "There was an error creating the job. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="custom-screen-lg mx-auto z-20">
      <div className="relative backdrop-blur-3xl z-10 max-w-4xl mx-auto space-y-4">
        <Card className="relative mt-20 py-10 z-20 backdrop-blur-3xl">
          <CardHeader>
            <CardTitle>Create Job</CardTitle>
            <CardDescription>
              Fill out the form below to create a new job listing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4 z-20">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  value={form.jobTitle}
                  onChange={handleChange}
                  name="jobTitle"
                  placeholder="Enter the job title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  value={form.company}
                  onChange={handleChange}
                  name="company"
                  placeholder="Enter the company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  value={form.location}
                  onChange={handleChange}
                  name="location"
                  placeholder="Enter the job location"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  value={form.description}
                  onChange={handleChange}
                  name="description"
                  placeholder="Enter the job description"
                  required
                />
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={pending}
                    variant="default"
                    className="inline-flex rounded-3xl text-center group items-center w-full justify-center bg-gradient-to-tr from-black/90 via-zinc-800 to-black border-input border-[1px] hover:bg-transparent/10 transition-colors sm:w-auto py-6 px-10"
                  >
                    Submit
                    {pending ? (
                      <Loader2 className="animate-spin ml-3 w-4 h-4 flex items-center" />
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to create this job?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. You will be creating a new
                      job listing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>
                      Create
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CreateJob;
