import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllJobs } from '../store/slices/jobsSlice';
import type { AppDispatch, RootState } from '../store';

const ManageJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'RECRUITER') {
      navigate('/');
      return;
    }

    dispatch(fetchAllJobs());
  }, [dispatch, currentUser, navigate]);

  // Filter jobs to only show those belonging to the current recruiter
  const recruiterJobs = jobs.filter(job => job.recruiter_id === currentUser?.id);

  useEffect(() => {
    // Log the filtered jobs for debugging
    console.log('Current user:', currentUser);
    console.log('All jobs:', jobs);
    console.log('Filtered recruiter jobs:', recruiterJobs);
  }, [jobs, currentUser, recruiterJobs]);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Job Listings</h1>
        <button
          onClick={() => navigate('/create-job')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create New Job
        </button>
      </div>

      {recruiterJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">You haven't posted any jobs yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1">
          {recruiterJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                  <p className="text-gray-600 mt-1">{job.company}</p>
                  <p className="text-gray-500 mt-1">{job.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs; 