import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllJobs } from '../store/slices/jobsSlice';
import type { AppDispatch, RootState } from '../store';
import type { Job } from '../services/api';
import { searchJobs } from '../services/api';
import JobSearch from './JobSearch';

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
        
        {/* Display Minimum and Maximum Salary under Company Name */}
        {job.minSalary !== undefined && job.maxSalary !== undefined && (
          <p className="mt-1 text-gray-600">
            Salary: {job.minSalary} - {job.maxSalary}
          </p>
        )}

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
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const userRole = useSelector((state: RootState) => state.user.user?.role);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (isAuthenticated && !isSearching) {
      dispatch(fetchAllJobs());
    }
  }, [dispatch, isAuthenticated, isSearching]);

  const handleSearch = async (searchParams: any) => {
    try {
      setIsSearching(true);
      const response = await searchJobs({
        ...searchParams,
        page: currentPage,
        size: 10
      });
      setSearchResults(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error searching jobs:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (isSearching) {
      handleSearch({ page: newPage });
    }
  };

  const displayedJobs = isSearching ? searchResults : jobs;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
        {userRole === 'RECRUITER' && (
          <button
            onClick={() => navigate('/create-job')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create New Job
          </button>
        )}
      </div>

      <JobSearch onSearch={handleSearch} />
      
      {displayedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No jobs found.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobListings; 