import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import api from '../services/api';

interface Application {
  applicationId: number;
  applicantUsername: string;
  status: string;
  job: {
    id: number;
    title: string;
  };
}

const ApplicationManagement = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!currentUser || currentUser.role !== 'RECRUITER') {
          navigate('/');
          return;
        }

        // Fetch job details first
        const jobResponse = await api.get(`/jobs/${jobId}`);
        setSelectedJob(jobResponse.data);

        // Fetch applications for this job
        const response = await api.get(`/applications/job/${jobId}`);
        console.log('Applications fetched:', response.data);
        setApplications(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError(err.message || 'Failed to fetch applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, navigate, currentUser]);

  const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      
      // Update the local state to reflect the change
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err: any) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status');
    }
  };

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
      <div className="mb-6">
        <button
          onClick={() => navigate('/manage-jobs')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job Listings
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Applications for {selectedJob?.title}
        </h1>
        <p className="text-gray-600">
          Total Applications: {applications.length}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No applications received yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <div
              key={application.applicationId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {application.applicantUsername}
                  </h2>
                  <p className="text-gray-600">
                    Applied for: {selectedJob?.title}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(application.status)}`}>
                  {application.status}
                </span>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <select
                  value={application.status}
                  onChange={(e) => handleStatusUpdate(application.applicationId, e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accept</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement; 