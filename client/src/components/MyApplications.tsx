import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import ApplicationSearch from './ApplicationSearch';
import api from '../services/api';

interface Application {
  applicationId: number;
  job_id: number;
  status: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  applicationDate?: string;
}

const MyApplications = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'JOB_SEEKER') {
      navigate('/');
      return;
    }

    const fetchApplications = async () => {
      try {
        // Fetch applications
        const response = await api.get('/applications');
        const applicationData = response.data;

        // Fetch job details for each application
        const applicationsWithJobDetails = await Promise.all(
          applicationData.map(async (app: Application) => {
            try {
              const jobResponse = await api.get(`/jobs/${app.job_id}`);
              return {
                ...app,
                jobTitle: jobResponse.data.title,
                company: jobResponse.data.company,
                location: jobResponse.data.location,
                applicationDate: new Date().toISOString() // Using current date as fallback
              };
            } catch (err) {
              console.error(`Error fetching job details for application ${app.applicationId}:`, err);
              return app;
            }
          })
        );

        setApplications(applicationsWithJobDetails);
        setFilteredApplications(applicationsWithJobDetails);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser, navigate]);

  const handleSearch = (searchParams: any) => {
    setIsSearching(true);
    let searchResults = applications;

    // Apply keyword search
    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase();
      searchResults = searchResults.filter(app => 
        app.jobTitle?.toLowerCase().includes(keyword) ||
        app.company?.toLowerCase().includes(keyword)
      );
    }

    // Apply status filter
    if (searchParams.status) {
      searchResults = searchResults.filter(app => 
        app.status.toUpperCase() === searchParams.status
      );
    }

    // Apply sorting
    if (searchParams.sortBy) {
      searchResults.sort((a: any, b: any) => {
        const direction = searchParams.sortDirection === 'DESC' ? -1 : 1;
        
        switch (searchParams.sortBy) {
          case 'applicationDate':
            return direction * (new Date(b.applicationDate || '').getTime() - new Date(a.applicationDate || '').getTime());
          case 'status':
            return direction * a.status.localeCompare(b.status);
          case 'jobTitle':
            return direction * ((a.jobTitle || '').localeCompare(b.jobTitle || ''));
          default:
            return 0;
        }
      });
    }

    setFilteredApplications(searchResults);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setFilteredApplications(applications);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Applications</h1>

      <ApplicationSearch onSearch={handleSearch} onClear={handleClearSearch} />

      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No applications found.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Browse Available Jobs →
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <div key={application.applicationId} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {application.jobTitle || 'Job Title Not Available'}
                  </h2>
                  <p className="text-gray-600 mb-2">{application.company || 'Company Not Available'}</p>
                  {application.location && (
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
                      {application.location}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              {application.applicationDate && (
                <div className="mt-4 text-sm text-gray-500">
                  Applied on: {formatDate(application.applicationDate)}
                </div>
              )}
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/jobs/${application.job_id}`)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Job Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications; 