import { Navbar } from "@/components/Navbar";
import { db, auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { Job } from "@/models/job";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import MyJobCard from "@/components/MyJobCard";
import Footer from "@/components/Footer";
const MyJobPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchAcceptedJobs = async () => {
      try {
        const jobsCollection = collection(db, "Jobs");
        const transactionsCollection = collection(db, "Transactions");

        const jobsSnapshot = await getDocs(jobsCollection);
        const allJobs = jobsSnapshot.docs.map((doc) => ({
          jobID: doc.id,
          ...doc.data(),
        })) as Job[];

        const q = query(
          transactionsCollection,
          where("freelancerID", "==", auth.currentUser?.uid),
          where("status", "==", "Accepted")
        );
        const transactionsSnapshot = await getDocs(q);

        const acceptedJobIDs = transactionsSnapshot.docs.map(
          (doc) => doc.data().jobID
        );

        const filteredJobs = allJobs.filter((job) =>
          acceptedJobIDs.includes(job.jobID)
        );
        setJobs(filteredJobs);
      } catch (error: any) {
        console.error("Error fetching jobs:", error.message);
      }
    };
    fetchAcceptedJobs();
  }, []);
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <div className="w-full border-b-2 fixed top-0 left-0 z-10">
        <Navbar />
      </div>
      <div className="mt-28 w-full flex flex-col px-32 flex-grow">
        <h2 className="text-3xl font-bold tracking-tight xs:text-center lg:text-left lg:text-6xl lg:leading-snug">
          My Job
        </h2>
        <div className="mt-10">
          {jobs.length === 0 ? (
            <div className="text-gray-500">
              You don't have active job, please apply one.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <MyJobCard key={job.jobID} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="relative bottom-0 mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default MyJobPage;
