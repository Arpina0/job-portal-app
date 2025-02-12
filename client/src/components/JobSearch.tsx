import React, { useState } from 'react';
import { JobType } from '../types';

interface JobSearchProps {
  onSearch: (searchParams: any) => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    jobType: '',
    sortBy: 'postedDate',
    sortDirection: 'DESC'
  });

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
      jobType: searchParams.jobType || undefined
    };
    onSearch(params);
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

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Search Jobs
        </button>
      </div>
    </form>
  );
};

export default JobSearch; 