import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Job } from "@/models/job";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { db, auth } from "@/firebase/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/models/user";
import { toast } from "@/hooks/use-toast";

const JobDetailPage = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [job, setJob] = useState<Job>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

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


  const handleApplyJob = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const transactionPost = {
        jobID: id,
        jobTitle: job?.title,
        companyID: job?.companyID,
        companyName: job?.companyName,
        freelancerID: auth.currentUser?.uid,
        freelancerName: authUser?.name,
        transactionDate: new Date(),
        status: "Waiting",
      };

      const newTransactionRef = doc(collection(db,"Transactions"))
      await setDoc(newTransactionRef,transactionPost);
      console.log("Transaction Added")
      toast({
        duration: 5000,
        title: "Job Applied",
        description: "Your application is waiting to be reviewed.",
      });
      navigate("/job")

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: error.message,
      });
    }
  };

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!id) {
        console.log("Invalid job ID");
        console.log(loading)
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
              <h3 className="font-semibold text-xl text-lime-700">
                Job Information
              </h3>
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
                  <span>
                    : Rp{job?.minBudget} - Rp{job?.maxBudget}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-52">
                    Communication Language
                  </span>
                  <span>: {job?.language}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-xl text-lime-700">
                Skills Required
              </h3>
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
              <Dialog>
                <DialogTrigger className="w-full h-12 bg-lime-500 hover:bg-white hover:text-lime-500 hover:border-lime-500 text-white focus:bg-lime-500">
                  Apply Job
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="mb-5">
                      Are you sure you want to apply for this job?
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. Once you apply, your
                      application will be submitted for review by the company.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-lime-500 hover:bg-white hover:text-lime-500 hover:border-lime-500"
                      onClick={(e)=>handleApplyJob(e)}
                    >
                      Apply
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 px-10">
        <h3 className="font-semibold text-xl text-lime-700">Job Description</h3>
        <p className="mt-3 text-lg text-gray-700">{job?.description}</p>
      </div>

    </>
  );
};

export default JobDetailPage;
