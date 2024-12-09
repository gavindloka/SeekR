import JobCard from "@/components/JobCard";
import { Navbar } from "@/components/Navbar";
import { Checkbox } from "@/components/ui/checkbox";
import { db, auth } from "@/firebase/firebase";
import { Job } from "@/models/job";
import { User } from "@/models/user";
import { CircularProgress } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const BrowseJobPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [costFilters, setCostFilters] = useState<string[]>([]);
  const [durationFilters, setDurationFilters] = useState<string[]>([]);
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
  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!authUser) return;
        setLoading(true);

        const jobsCollection = collection(db, "Jobs");
        const jobsSnapshot = await getDocs(jobsCollection);
        const allJobs = jobsSnapshot.docs.map((doc) => ({
          jobID: doc.id,
          ...(doc.data() as Omit<Job, "jobID">),
        }));

        const transactionsCollection = collection(db, "Transactions");
        const q = query(transactionsCollection);
        const transactionsSnapshot = await getDocs(q);

        const acceptedJobIDs = transactionsSnapshot.docs
          .filter((doc) => doc.data().status === "Accepted")
          .map((doc) => doc.data().jobID);

        const filteredJobs = allJobs.filter(
          (job) => !acceptedJobIDs.includes(job.jobID)
        );

        const userSkills = authUser?.skills || [];
        console.log(userSkills);
        const rankedJobs = filteredJobs
          .map((job) => {
            console.log(job.skills);
            const matchingSkills = job.skills.filter((skill) =>
              userSkills.includes(skill)
            ).length;
            console.log(matchingSkills);
            return { ...job, score: matchingSkills };
          })
          .sort((a, b) => b.score - a.score);

        console.log(rankedJobs);
        setJobs(rankedJobs);
      } catch (error: any) {
        console.error("Error fetching jobs:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [authUser]);

  const toggleFilter = (filter: string, type: string) => {
    if (type === "cost") {
      setCostFilters((prev) =>
        prev.includes(filter)
          ? prev.filter((item) => item !== filter)
          : [...prev, filter]
      );
    } else if (type === "duration") {
      setDurationFilters((prev) =>
        prev.includes(filter)
          ? prev.filter((item) => item !== filter)
          : [...prev, filter]
      );
    }
  };
  const filteredJobs = jobs.filter((job) => {
    const matchesCost =
      costFilters.length === 0 ||
      costFilters.some((filter) => {
        if (filter === "below100k") return job.maxBudget < 100000;
        if (filter === "100kTo500k")
          return job.minBudget >= 100000 && job.maxBudget <= 500000;
        if (filter === "500kTo1M")
          return job.minBudget >= 500000 && job.maxBudget <= 1000000;
        if (filter === "1MTo5M")
          return job.minBudget >= 1000000 && job.maxBudget <= 5000000;
        if (filter === "above5M") return job.minBudget > 5000000;
      });

    const matchesDuration =
      durationFilters.length === 0 ||
      durationFilters.some((filter) => {
        if (filter === "below1Week") return job.duration < 7;
        if (filter === "1-4weeks")
          return job.duration >= 7 && job.duration <= 28;
        if (filter === "1-6months")
          return job.duration > 28 && job.duration <= 180;
        if (filter === "above6Months") return job.duration > 180;
      });

    return matchesCost && matchesDuration;
  });

  return (
    <>
      <div className="flex w-screen min-h-screen">
        <div className="w-full border-b-2 fixed top-0 left-0 z-10">
          <Navbar />
        </div>
        <div className="mt-16 w-full flex text-gray-700">
          <div className="w-60 px-7 pt-10 h-full bg-lime-100 rounded-tr-3xl rounded-br-2xl">
            <h2 className="text-2xl font-bold text-lime-700">Filters</h2>
            <h4 className="text-lg font-medium text-lime-700 mt-6">Cost</h4>
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="below100k"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("below100k", "cost")}
              />
              <label
                htmlFor="below100k"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Below 100,000
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="100kTo500k"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("100kTo500k", "cost")}
              />
              <label
                htmlFor="100kTo500k"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                100,000 - 500,000
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="500kTo1M"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("500kTo1M", "cost")}
              />
              <label
                htmlFor="500kTo1M"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                500,000 - 1,000,000
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="1MTo5M"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("1MTo5M", "cost")}
              />
              <label
                htmlFor="1MTo5M"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                1,000,000 - 5,000,000
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="above5M"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("above5M", "cost")}
              />
              <label
                htmlFor="above5M"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Above 5,000,000
              </label>
            </div>

            <h4 className="text-lg font-medium text-lime-700 mt-6">Duration</h4>
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="below1Week"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("below1Week", "duration")}
              />
              <label
                htmlFor="below1Week"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Less than 1 week
              </label>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="1-4weeks"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("1-4weeks", "duration")}
              />
              <label
                htmlFor="1-4weeks"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                1 - 4 weeks
              </label>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="1-6months"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("1-6months", "duration")}
              />
              <label
                htmlFor="1-6months"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                1 - 6 months
              </label>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="above6Months"
                className="peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent flex justify-center items-center p-2 appearance-none h-4 w-4 border border-gray-500 rounded-md data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 data-[state=checked]:text-white focus:outline-none cursor-pointer  data-[state=checked]:after:flex data-[state=checked]:after:justify-center data-[state=checked]:after:items-center"
                onClick={() => toggleFilter("above6Months", "duration")}
              />
              <label
                htmlFor="above6Months"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Above 6 months
              </label>
            </div>
          </div>
          <div className="pt-10">
            <div className="px-10 xs:mx-auto lg:mx-0 xs:pl-0">
              <h1 className="font-bold tracking-tight lg:text-6xl lg:leading-snug mx-10">
                Top <span className="text-lime-500">Job Picks</span> for{" "}
                <span className="text-yellow-500">You</span>
              </h1>
            </div>
            {loading?(
              <div className="absolute inset-0 flex justify-center items-center">
              <CircularProgress color="success"/>
              </div>
            ):(
              <div className="mt-10 mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredJobs.map((job) => (
                  <JobCard key={job.jobID} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseJobPage;
