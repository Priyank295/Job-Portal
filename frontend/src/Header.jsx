import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between h-[60px] items-center">
      <div>
        <h3>LOGO</h3>
      </div>
      <NavigationMenu className=" text-gray-100 p-4 w-full">
        <NavigationMenuList className="flex space-x-4 text-black">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className="flex items-center space-x-2 text-black "
              onClick={() => setCurrentView("home")}
            >
              <Home size={20} />
              <span>Home</span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className="flex items-center space-x-2"
              onClick={() => setCurrentView("candidates")}
            >
              <Users size={20} />
              <span>Candidates</span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className="flex items-center space-x-2 "
              onClick={() => setCurrentView("jobs")}
            >
              <Briefcase size={20} />
              <span>Jobs</span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className="flex items-center space-x-2 "
              onClick={() => setCurrentView("create-job")}
            >
              <PlusCircle size={20} />
              <span>Create Job</span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          {role === "Recruiter" || role === "Hiring_Manager" ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="flex items-center space-x-2 "
                onClick={() => setCurrentView("create-job")}
              >
                <CheckCheck size={20} />
                <span>
                  {role === "Recruiter"
                    ? "Approve Candidate"
                    : role === "Hiring_Manager"
                    ? "Approve Job"
                    : ""}
                </span>
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
          <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
