import React, { useState } from 'react';
import { JobType, JobStatus } from '../types';

interface JobSearchProps {
  onSearch: (searchParams: any) => void;
  onClear: () => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ onSearch, onClear }) => {
  const initialSearchParams = {
    keyword: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    jobType: '',
    status: '',
    sortBy: 'postedDate',
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
    // Convert salary strings to numbers if they're not empty
    const params = {
      ...searchParams,
      minSalary: searchParams.minSalary ? parseFloat(searchParams.minSalary) : undefined,
      maxSalary: searchParams.maxSalary ? parseFloat(searchParams.maxSalary) : undefined,
      jobType: searchParams.jobType || undefined,
      status: searchParams.status || undefined
    };
    onSearch(params);
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
            Keywords
          </label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            placeholder="Job title, skills, or company"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={searchParams.location}
            onChange={handleChange}
            placeholder="City, state, or remote"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Job Type */}
        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
            Job Type
          </label>
          <select
            id="jobType"
            name="jobType"
            value={searchParams.jobType}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        {/* Status */}
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
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Min Salary
          </label>
          <input
            type="number"
            id="minSalary"
            name="minSalary"
            value={searchParams.minSalary}
            onChange={handleChange}
            placeholder="Minimum salary"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Max Salary
          </label>
          <input
            type="number"
            id="maxSalary"
            name="maxSalary"
            value={searchParams.maxSalary}
            onChange={handleChange}
            placeholder="Maximum salary"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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
            <option value="postedDate">Posted Date</option>
            <option value="minSalary">Salary</option>
            <option value="title">Title</option>
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

export default JobSearch; 