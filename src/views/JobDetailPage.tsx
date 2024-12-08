import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Job } from "@/models/job";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const JobDetailPage = () => {
  const [job, setJob] = useState<Job>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!id) {
        console.log("Invalid job ID");
        setLoading(false);
        return;
      }
      try {
        const jobDoc = doc(db, "Jobs", id);
        const jobSnap = await getDoc(jobDoc);

        if (jobSnap.exists()) {
          setJob(jobSnap.data() as Job);
        } else {
          console.log("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJobDetail();
  }, [id]);

  return (
    <>
    <div className="flex w-screen">
      <div className="w-full border-b-2 fixed top-0 left-0 z-10">
        <Navbar />
      </div>

      <div className="mt-28 px-10 w-full lg:flex">
        <div className="w-full h-[413px] lg:w-1/2 ">
          <img
            src={job?.imageUrl}
            alt="Job Image"
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div className="ml-0 lg:ml-10 w-full h-full lg:w-1/2">
          <h1 className="font-bold tracking-tight text-2xl lg:text-4xl text-lime-700">
            {job?.title}
          </h1>
          <div className="mt-7">
            <h3 className="font-semibold text-xl text-lime-700">Job Information</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <span className="font-semibold w-52">Company Name</span>
                <span>: {job?.companyName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-52">Duration</span>
                <span>: {job?.duration} days</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-52">Cost Range</span>
                <span>: Rp{job?.minBudget} - Rp{job?.maxBudget}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-52">Communication Language</span>
                <span>: {job?.language}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-xl text-lime-700">Skills Required</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {job?.skills &&
                job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-lime-200 text-lime-700 text-xs p-2 rounded-lg whitespace-nowrap"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>

          <div className="mt-9 w-full lg:w-36">
            <Button className="w-full h-12 bg-lime-500 text-white py-2 px-4 rounded-lg">
              Apply Job
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-8 px-10">
        <h3 className="font-semibold text-xl text-lime-700">Job Description</h3>
        <p className="mt-3 text-lg text-gray-700">{job?.description}</p>
      </div>
    <div className="relative mt-10">
      <Footer/>
    </div>
    </>
  );
};

export default JobDetailPage;
