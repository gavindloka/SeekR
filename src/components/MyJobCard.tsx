import { auth, db } from "@/firebase/firebase";
import { Job } from "@/models/job";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface JobCardProps {
  job: Job;
}
const MyJobCard: FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  const [showAllSkills, setShowAllSkills] = useState(false);
  const toggleSkills = () => {
    setShowAllSkills(!showAllSkills);
  };

  return (
    <div className="w-80 rounded-lg overflow-hidden border bg-white">
      <img
        className="w-full h-36 object-cover"
        src={job.imageUrl}
        alt="product"
      />
      <div className="px-6 py-4">
        <div className="flex justify-between mb-1">
          <div className="text-gray-700 text-sm">{job.companyName}</div>
          <div className="text-gray-700 text-sm">
            Duration:{" "}
            {job.duration > 30
              ? `${Math.floor(job.duration / 30)} month${
                  Math.floor(job.duration / 30) > 1 ? "s" : ""
                }`
              : `${job.duration} day${job.duration > 1 ? "s" : ""}`}
          </div>
        </div>
        <h2 className="font-bold text-xl mb-2 text-lime-700">{job.title}</h2>
        <p className="text-gray-700 text-base mb-4">{job.description}</p>
        <div className="flex flex-col gap-2 align-middle">
          <div className="flex flex-wrap gap-2">
            {job.skills &&
              job.skills
                .slice(0, showAllSkills ? job.skills.length : 1)
                .map((skill, index) => (
                  <span
                    key={index}
                    className="bg-lime-200 text-lime-700 text-xs p-2 rounded-lg whitespace-nowrap"
                  >
                    {skill}
                  </span>
                ))}
          </div>
          {job.skills && job.skills.length > 1 && (
            <div
              className={`text-lime-500 text-xs cursor-pointer algi ${
                showAllSkills ? "mr-9" : "mr-0"
              }`}
              onClick={toggleSkills}
            >
              {showAllSkills ? "Close" : "See More"}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-gray-800 text-sm">
            Rp{job.minBudget} - Rp{job.maxBudget}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyJobCard;
