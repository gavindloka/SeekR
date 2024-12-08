import { Navbar } from "@/components/Navbar";
import React from "react";

const MyJobPage = () => {
  return (
    <div className="flex w-screen min-h-screen">
      <div className="w-full border-b-2 fixed top-0 left-0 z-10">
        <Navbar />
      </div>
      <div className="mt-28 w-full flex px-32">
        <h2 className="text-3xl font-bold tracking-tight xs:text-center lg:text-left lg:text-6xl lg:leading-snug">My Job</h2>
      </div>
      
    </div>
  );
};

export default MyJobPage;
