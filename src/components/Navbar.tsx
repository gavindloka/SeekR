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
    title: "Browse Jobs",
    href: "/job",
    description:
      "Where freelancers can browse and apply for job opportunities.",
  },
  {
    title: "My Jobs",
    href: "/job/personal",
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
    href: "/post",
    description: "A simple form for employers to post jobs.",
  },
  {
    title: "Manage Applicants",
    href: "/applicants",
    description:
      "A page where employers can review, accept, or decline job applicants.",
  },
  {
    title: "Active Job Listing",
    href: "/job/manage",
    description: "Employers can evaluate their active job listings.",
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
      navigate("/");
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
        {authUser?.role === "freelancer" ? (
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
        ) : (
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
        )}
      </NavigationMenuList>

      {authUser ? (
        <NavigationMenuList>
          <div>
            Hello,{" "}
            <span className="mr-4 font-bold text-lime-500">
              {authUser.name}
            </span>
          </div>
          <Button
            variant="outline"
            className="hover:border-lime-500 hover:text-lime-500"
            onClick={() => logout()}
          >
            Log out
          </Button>
        </NavigationMenuList>
      ) : (
        <NavigationMenuList>
          <Button
            variant="ghost"
            className=" bg-white border-none"
            onClick={() => navigate("/login")}
          >
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
