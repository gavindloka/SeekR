import { Navbar } from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db, auth } from "@/firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/models/transaction";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const ManageApplicantsPage = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  const fetchTransactions = async (uid: string) => {
    try {
      const transactionsCollection = collection(db, "Transactions");
      const q = query(
        transactionsCollection,
        where("companyID", "==", uid),
        where("status", "==", "Waiting")
      );
      const transactionsSnapshot = await getDocs(q);
      if (!transactionsSnapshot.empty) {
        const transactions = transactionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as Transaction[];
        setTransactionList(transactions);
      } else {
        setTransactionList([]);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        fetchTransactions(user.uid);
      } else {
        console.warn("User is not authenticated.");
      }
    });
    return () => unsubscribe();
  }, []);
  const handleAccept = async (transactionID: string) => {
    try {
      const transactionDoc = doc(db, "Transactions", transactionID);
      await updateDoc(transactionDoc, { status: "Accepted" });
      setTransactionList((prev) =>
        prev.map((transaction) =>
          transaction.id === transactionID
            ? { ...transaction, status: "Accepted" }
            : transaction
        )
      );
      console.log("accepted");
      toast({
        duration: 5000,
        title: "Applicant Accepted",
        description: "The applicant was accepted.",
      });
      if (auth.currentUser?.uid) {
        fetchTransactions(auth.currentUser.uid);
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };
  const handleReject = async (transactionID: string) => {
    try {
      const transactionDoc = doc(db, "Transactions", transactionID);
      await deleteDoc(transactionDoc);

      setTransactionList((prev) =>
        prev.filter((transaction) => transaction.id !== transactionID)
      );

      toast({
        duration: 5000,
        title: "Applicant Rejected",
        description: "The applicant has been rejected.",
      });
      if (auth.currentUser?.uid) {
        fetchTransactions(auth.currentUser.uid);
      }
      console.log("rejected");
    } catch (error) {
      console.error("Error rejecting transaction:", error);
    }
  };

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <div className="w-full border-b-2 fixed top-0 left-0 z-10">
        <Navbar />
      </div>
      <div className="mt-28 w-full flex flex-col gap-10 px-32">
        <h2 className="text-3xl font-bold tracking-tight xs:text-center lg:text-left lg:text-6xl lg:leading-snug">
          Manage Applicants
        </h2>
        <div>
          <Table>
            <TableCaption>
              {transactionList.length > 0
                ? "A list of your recent Applicants."
                : "No applicants to display."}
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Freelancer Name</TableHead>
                <TableHead className="w-[50px] text-center">Accept</TableHead>
                <TableHead className="w-[50px] text-center">Reject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionList.map((transaction) => (
                <TableRow key={transaction.jobID}>
                  <TableCell className="font-medium">
                    {transaction.jobID}
                  </TableCell>
                  <TableCell>{transaction.jobTitle}</TableCell>
                  <TableCell>{transaction.freelancerName}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-lime-500 text-white py-1 px-4 rounded-md hover:bg-lime-600"
                      onClick={() => handleAccept(transaction.id)}
                    >
                      Accept
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                      onClick={() => handleReject(transaction.id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="relative bottom-0 mt-72">
      <Footer />
      </div>
    </div>
  );
};

export default ManageApplicantsPage;
