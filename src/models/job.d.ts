export interface Job {
    jobID:string;
    title: string;
    description: string;
    imageUrl:string;
    language: string;
    minBudget:number;
    maxBudget:number;
    duration:number;
    companyID:string;
    companyName:string;
    skills: string[];
  }