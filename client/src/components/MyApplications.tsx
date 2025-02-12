import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import api from '../services/api';

interface Application {
  id: number;
  job_id: number;
  status: string;
  job?: {
    title: string;
    company: string;
    location: string;
  };
}

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!currentUser || currentUser.role !== 'JOB_SEEKER') {
          navigate('/');
          return;
        }

        // Fetch all applications for the current user
        const response = await api.get('/applications');
        console.log('Applications fetched:', response.data);

        // For each application, fetch the job details
        const applicationsWithJobs = await Promise.all(
          response.data.map(async (app: Application) => {
            try {
              const jobResponse = await api.get(`/jobs/${app.job_id}`);
              return {
                ...app,
                job: jobResponse.data
              };
            } catch (err) {
              console.error(`Error fetching job ${app.job_id}:`, err);
              return app;
            }
          })
        );

        setApplications(applicationsWithJobs);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError(err.message || 'Failed to fetch applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate, currentUser]);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">You haven't applied to any jobs yet.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Browse Available Jobs →
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 
                    className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-indigo-600"
                    onClick={() => navigate(`/jobs/${application.job_id}`)}
                  >
                    {application.job?.title || 'Job Title Not Available'}
                  </h2>
                  {application.job && (
                    <>
                      <p className="text-gray-600 mb-1">{application.job.company}</p>
                      <p className="text-gray-500 flex items-center">
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
                        {application.job.location}
                      </p>
                    </>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications; 