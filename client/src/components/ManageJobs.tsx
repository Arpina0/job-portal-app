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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="text-gray-600">{job.company}</div>
                  <div className="text-gray-500 mt-1 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-gray-500 text-sm">Posted Date:</span>
                    <div className="text-gray-900">{formatDate(job.postedDate)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Job Type:</span>
                    <div className="text-gray-900">{job.type?.replace('_', ' ')}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate(`/edit-job/${job.id}`)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                  <button
                    onClick={() => navigate(`/applications/${job.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Manage Applications
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs; 