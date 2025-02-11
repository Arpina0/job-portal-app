import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllJobs } from '../store/slices/jobsSlice';
import type { AppDispatch, RootState } from '../store';
import type { Job } from '../services/api';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }: { job: Job }) => {
  const navigate = useNavigate();

  const formatJobType = (type: string) => {
    return type?.replace('_', ' ') || 'FULL TIME';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {job.title || 'Untitled Position'}
        </h2>
        <p className="text-gray-600 mb-4">{job.company || 'Company Name'}</p>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location || 'Location Not Specified'}
        </div>
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {formatJobType(job.type)}
          </span>
          <span className="text-sm text-gray-500">
            Posted: {new Date(job.postedDate || Date.now()).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-4 text-gray-600 line-clamp-3">
          {job.description || 'No description available'}
        </p>
        <button 
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const JobListings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log('JobListings mounted, authenticated:', isAuthenticated);
    if (isAuthenticated) {
      dispatch(fetchAllJobs());
    }
  }, [dispatch, isAuthenticated]);

  console.log('JobListings render state:', { loading, error, jobsCount: jobs.length });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Listings</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No jobs found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Listings</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobListings; 