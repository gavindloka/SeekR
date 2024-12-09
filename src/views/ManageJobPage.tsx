import { Navbar } from "@/components/Navbar";
import { db, auth } from "@/firebase/firebase";
import { Job } from "@/models/job";
import { User } from "@/models/user";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ManageJobCard from "@/components/ManageJobCard";
import { Transaction } from "@/models/transaction";
import Footer from "@/components/Footer";

type JobWithProgress = Job & { progress: number };

const ManageJobPage = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<
    (Job & { progress: number })[]
  >([]);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuthUser(docSnap.data() as User);
          console.log(docSnap.data());
          console.log(authUser)
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

  const calculateProgress = (
    transactionDate: Date,
    duration: number
  ): number | "Done" => {
    const startDate = new Date(transactionDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);
    console.log(transactionDate)
    console.log(endDate)
    const today = new Date();
    
    const totalDuration = Math.max(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      0
    ); 
    console.log(totalDuration)
    const daysElapsed = Math.max(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      0
    ); 
    console.log(daysElapsed)


    const progress = Math.min((daysElapsed / totalDuration) * 100, 100);
    console.log(progress) 
   
    return Math.round(progress);

  };

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
          where("companyID", "==", auth.currentUser?.uid),
          where("status", "==", "Accepted")
        );
        const transactionsSnapshot = await getDocs(q);
        const acceptedTransactions = transactionsSnapshot.docs.map((doc) => {
          const transaction = doc.data() as Transaction;
          console.log("Transaction Data:", transaction.transactionDate.toDate().getDate());
          return transaction;
        });

        const acceptedJobs: JobWithProgress[] = acceptedTransactions
          .map((transaction) => {
            const job = allJobs.find((job) => job.jobID === transaction.jobID);
            if (!job) return null;

            return {
              ...job,
              progress: calculateProgress(
                transaction.transactionDate.toDate(),
                job.duration
              ), 
            };
          })
          .filter((job): job is JobWithProgress => job !== null);

          
        setFilteredJobs(acceptedJobs);
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
          Active Jobs
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredJobs.map((job) => (
            <ManageJobCard key={job.jobID} job={job} progress={job.progress} />
          ))}
        </div>
      </div>
      <div className="relative bottom-0 mt-20">
      <Footer />
      </div>
    </div>
  );
};

export default ManageJobPage;
