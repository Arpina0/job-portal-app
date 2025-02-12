import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobDetails, clearSelectedJob, deleteJob } from '../store/slices/jobsSlice';
import { fetchUserData } from '../store/slices/userSlice';
import type { AppDispatch, RootState } from '../store';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedJob, loading, error } = useSelector((state: RootState) => state.jobs);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // First fetch the job details
    if (id) {
      console.log('Fetching job details for ID:', id);
      dispatch(fetchJobDetails(parseInt(id)))
        .unwrap()
        .then((jobData) => {
          console.log('Successfully fetched job details:', jobData);
          dispatch(fetchUserData());
        })
        .catch((error) => {
          console.error('Error fetching job details:', error);
        });
    }

    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, id, isAuthenticated, navigate]);

  // Move these checks inside the render where we know selectedJob exists
  const checkIsRecruiter = () => {
    console.log("selected job", selectedJob);
    console.log("Current User ID:", currentUser?.id);
    console.log("Job Recruiter ID:", selectedJob?.recruiter_id);
    return currentUser?.id === selectedJob?.recruiter_id;
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await dispatch(deleteJob(selectedJob.id));
        navigate('/jobs');
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const formatJobType = (type: string | undefined) => {
    return type?.replace('_', ' ') || 'FULL TIME';
  };

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

  if (!selectedJob) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  const isRecruiter = checkIsRecruiter();
  const isJobSeeker = currentUser?.role === 'JOB_SEEKER';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedJob.title || 'Untitled Position'}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {selectedJob.company || 'Company Name'}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {formatJobType(selectedJob.type)}
            </span>
          </div>

          <div className="flex items-center text-gray-500 mb-6">
            <svg
              className="h-5 w-5 mr-2"
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
            {selectedJob.location || 'Location not specified'}
          </div>

          {selectedJob.minSalary !== undefined && selectedJob.maxSalary !== undefined && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Salary</h2>
              <p className="text-gray-600">
                {selectedJob.minSalary} - {selectedJob.maxSalary}
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {selectedJob.description || 'No description available'}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {selectedJob.requirements || 'No requirements specified'}
            </p>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/jobs')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Jobs
            </button>
            <div className="flex gap-4">
              {isRecruiter ? (
                <>
                  <button
                    onClick={() => navigate(`/edit-job/${selectedJob.id}`)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={handleDeleteJob}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete Job
                  </button>
                </>
              ) : isJobSeeker ? (
                <button 
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    // Add your apply job logic here
                    console.log('Applying for job:', selectedJob.id);
                  }}
                >
                  Apply Now
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 