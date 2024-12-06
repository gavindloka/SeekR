"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/models/user";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";

const freelancerComponents: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Create Profile",
    href: "/docs/freelancers/create-profile",
    description: "A form where freelancers can create their profile.",
  },
  {
    title: "Submit Proposal",
    href: "/docs/freelancers/submit-proposal",
    description: "A simple form to submit proposals to job listings.",
  },
  {
    title: "Portfolio",
    href: "/docs/freelancers/portfolio",
    description:
      "Allow freelancers to showcase their past work with links or file uploads.",
  },
  {
    title: "My Jobs",
    href: "/docs/freelancers/jobs-dashboard",
    description: "A dashboard where freelancers can track their jobs.",
  },
];

const employerComponents: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Post a Job",
    href: "/docs/employers/post-job",
    description: "A simple form for employers to post jobs.",
  },
  {
    title: "Browse Freelancers",
    href: "/docs/employers/browse-freelancers",
    description:
      "Allow employers to search and filter freelancers based on skills.",
  },
  {
    title: "View Freelancer Profiles",
    href: "/docs/employers/view-freelancer-profiles",
    description: "Employers can view detailed freelancer profiles.",
  },
  {
    title: "Manage Job Listings",
    href: "/docs/employers/manage-job-listings",
    description:
      "A page where employers can edit or delete their posted job listings.",
  },
];

export function Navbar() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuthUser(docSnap.data() as User);
          console.log(docSnap.data());
        } else {
          console.log("User data not found");
        }
      } else {
        console.log("User is not authenticated");
      }
    });
  };

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  React.useEffect(() => {
    fetchUserData();
  }, [auth]);
  return (
    <NavigationMenu className="flex justify-between items-center bg-white py-3 px-7">
      <NavigationMenuList>
        <NavigationMenuItem>
          <h1
            className="scroll-m-20 text-2xl font-semibold tracking-tight mr-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Seek
            <label
              className=" text-lime-500 cursor-pointer"
              onClick={() => navigate("/")}
            >
              R
            </label>
          </h1>
        </NavigationMenuItem>
        <NavigationMenuItem className="xs:hidden sm:block">
          <NavigationMenuTrigger>Find Work</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {freelancerComponents.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="xs:hidden sm:block">
          <NavigationMenuTrigger>Find Talent</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {employerComponents.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>

      {authUser ? (
        <NavigationMenuList>
          <div>
            Hello, <span className="mr-4 font-bold text-lime-500">{authUser.name}</span>
          </div>
          <Button variant="outline" className="hover:border-lime-500 hover:text-lime-500" onClick={()=>logout()}>
            Log out
          </Button>
        </NavigationMenuList>
      ) : (
        <NavigationMenuList>
          <Button variant="ghost" className=" bg-white border-none" onClick={() => navigate("/login")} >
            Log in
          </Button>
          <Button className="bg-lime-500" onClick={() => navigate("/register")}>
            Register
          </Button>
        </NavigationMenuList>
      )}
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block text-lime-600 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
