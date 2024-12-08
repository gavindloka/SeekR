import { Timestamp } from "firebase/firestore";

export interface Transaction{
    id:string;
    jobID:string;
    jobTitle:string;
    companyID:string;
    companyName:string;
    freelancerID:string;
    freelancerName:string;
    transactionDate: Timestamp;
    status:string;
}