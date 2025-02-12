import React, { useState } from 'react';

interface ApplicationSearchProps {
  onSearch: (searchParams: any) => void;
  onClear: () => void;
}

const ApplicationSearch: React.FC<ApplicationSearchProps> = ({ onSearch, onClear }) => {
  const initialSearchParams = {
    keyword: '',
    status: '',
    sortBy: 'applicationDate',
    sortDirection: 'DESC'
  };

  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchParams(initialSearchParams);
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Keyword Search */}
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            placeholder="Job title or company"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Application Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={searchParams.status}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={searchParams.sortBy}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="applicationDate">Application Date</option>
            <option value="status">Status</option>
            <option value="jobTitle">Job Title</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Clear
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default ApplicationSearch; 