import JobCard from "@/components/JobCard";
import { Navbar } from "@/components/Navbar";
import { db } from "@/firebase/firebase";
import { Job } from "@/models/job";
import { Button } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const BrowseJobPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchJobs = async()=>{
      try {
        const jobsCollection = collection(db,"Jobs")
        const jobsSnapshot = await getDocs(jobsCollection)
        const jobList = jobsSnapshot.docs.map(doc=>({
          jobID: doc.id,
          ...doc.data() as Omit<Job, 'jobID'> 
        }))
        console.log(jobList)
        setJobs(jobList)
      } catch (error:any) {
        console.error(error.message)
      }finally{
        setLoading(false)
      }
    }

    fetchJobs();
  }, [])
  
  return (
    <>
      <div className="flex w-screen min-h-screen">
        <div className="w-full border-b-2 fixed top-0 left-0 z-10">
          <Navbar />
        </div>
        <div className="mt-16 w-full flex">
          <div className="w-60 px-7 pt-10 h-full bg-lime-100 rounded-tr-3xl rounded-br-2xl">
            <h2 className="text-2xl font-bold text-lime-700">Filters</h2>
          </div>
          <div className="pt-10">
            <div className="px-10 xs:mx-auto lg:mx-0 xs:pl-0">
              <motion.h1
                className="font-bold tracking-tight lg:text-6xl lg:leading-snug mx-10"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Top <span className="text-lime-500">Job Picks</span> for{" "}
                <span className="text-yellow-500">You</span>
              </motion.h1>
            </div>
            <div className="mt-10 mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {jobs.map((job)=>(
                <JobCard key={job.jobID} job = {job}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseJobPage;
