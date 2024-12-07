import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '@/firebase/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { Job } from '@/models/job';

const JobDetailPage = () => {
    const [job, setJob] = useState<Job>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {id} = useParams();
    
    useEffect(() => {
        const fetchJobDetail = async () => {
            if (!id) {
                setError('Invalid job ID');
                setLoading(false);
                return;
              }
          try {
            const jobDoc = doc(db, "Jobs", id);
            const jobSnap = await getDoc(jobDoc);

            if (jobSnap.exists()) {
              setJob(jobSnap.data() as Job);
            } else {
              setError("Job not found");
            }
          } catch (err) {
            console.error('Error fetching job:', err);
            setError('Failed to fetch job details');
          } finally {
            setLoading(false);
          }
        };
    
        if (id) fetchJobDetail();
      }, [id]);
    
  return (
    <>
    <div>JobID: {id}</div>
    <div>{job?.companyName}</div>
    <div>{job?.title}</div>
    <div>{job?.description}</div>

    </>
    
  )
}

export default JobDetailPage