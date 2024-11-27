import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import Jobs from "./Candidate/Jobs";
import {
  Bell,
  Home,
  Users,
  Briefcase,
  PlusCircle,
  CheckCheck,
  Notebook,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Notification from "./Notifications";
import AllCandidate from "./Candidate/AllCandidate";
import CreateJob from "./Recruiter/CreateJob";
import ApproveCandidate from "./Recruiter/ApproveCandidate";
import ApproveJob from "./Manager/ApproveJob";
import MyApplication from "./Candidate/MyApplication";
import ApproveToHire from "./Manager/ApproveToHire";
import AdminDashboard from "./Admin/AdminDashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    setIsAlertOpen(false);
  };
  const [currentView, setCurrentView] = useState("jobs");

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <AdminDashboard />;
      case "candidates":
        return <AllCandidate />;
      case "jobs":
        return <Jobs />;
      case "create-job":
        return <CreateJob />;
      case "approve-candidate":
        return <ApproveCandidate />;
      case "my-applications":
        return <MyApplication />;
      case "approve-job":
        return <ApproveJob />;
      case "approve-hire":
        return <ApproveToHire />;
      default:
        return <Jobs />;
    }
  };
  return (
    <div className="h-screen">
      <div className="flex justify-between h-[60px] items-center">
        <div>
          <h3>Welcome {role}</h3>
        </div>
        <NavigationMenu className=" text-gray-100 p-4 w-full">
          <NavigationMenuList className="flex space-x-4 text-black">
            {role === "Admin" ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="flex items-center space-x-2 text-black "
                  onClick={() => setCurrentView("home")}
                >
                  <Home size={20} />
                  <span>Home</span>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : null}

            {role === "Recruiter" || role === "Hiring_Manager" ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="flex items-center space-x-2"
                  onClick={() => setCurrentView("candidates")}
                >
                  <Users size={20} />
                  <span>Candidates</span>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : null}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="flex items-center space-x-2 "
                onClick={() => setCurrentView("jobs")}
              >
                <Briefcase size={20} />
                <span>Jobs</span>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            {role === "Candidate" ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="flex items-center space-x-2 "
                  onClick={() => setCurrentView("my-applications")}
                >
                  <Notebook size={20} />
                  <span>My Applications</span>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : null}
            {role === "Recruiter" ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="flex items-center space-x-2 "
                  onClick={() => setCurrentView("create-job")}
                >
                  <PlusCircle size={20} />
                  <span>Create Job</span>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : null}
            {role === "Recruiter" ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="flex items-center space-x-2 "
                  onClick={() => setCurrentView("approve-candidate")}
                >
                  <CheckCheck size={20} />
                  <span>Approve Candidate</span>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : null}
            {role === "Hiring_Manager" ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="flex items-center space-x-2 "
                  onClick={() => setCurrentView("approve-job")}
                >
                  <CheckCheck size={20} />
                  <span>Approve Job</span>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : null}
            {role === "Hiring_Manager" ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="flex items-center space-x-2 "
                  onClick={() => setCurrentView("approve-hire")}
                >
                  <CheckCheck size={20} />
                  <span>Approve To Hire</span>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ) : null}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="flex items-center space-x-2 "
                onClick={() => setCurrentView("notifications")}
              >
                <Bell size={20} />
                <span>Notifications</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Notification />
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to sign out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will log you out of your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut}>
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <main className="p-4">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
