import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchAllJobs } from '../store/slices/jobsSlice';
import type { AppDispatch } from '../store'; // Import AppDispatch type
import { RootState } from '../store'; // Import RootState type
import { createJob } from '../services/api';  // Import the createJob function
import { fetchUserData } from '../store/slices/userSlice';

axios.defaults.baseURL = 'http://localhost:8080';  // Backend server URL'iniz

const CreateJob = () => {
    const [jobData, setJobData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        minSalary: '',
        maxSalary: '',
        type: 'FULL_TIME', // Default value
        status: 'OPEN', // Default value
    });

    const dispatch = useDispatch<AppDispatch>(); // Use the AppDispatch type
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        console.log('CreateJob component mounted');
        if (!currentUser) {
            console.log('No user data found, fetching...');
            dispatch(fetchUserData());
        } else {
            console.log('Current user data:', currentUser);
        }
    }, [currentUser, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJobData({ ...jobData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Current user:', currentUser); // Add this log
            
            if (!currentUser?.id) {
                console.error('No user ID found');
                return;
            }

            const jobDataToSend = {
                ...jobData,
                minSalary: parseFloat(jobData.minSalary),
                maxSalary: parseFloat(jobData.maxSalary),
                type: jobData.type || 'FULL_TIME',
                status: jobData.status || 'OPEN',
                recruiter_id: currentUser.id
            };

            console.log('Preparing to send job data:', jobDataToSend);

            // Use the createJob function from our api service
            const response = await createJob(jobDataToSend);
            console.log('Job created successfully:', response);

            dispatch(fetchAllJobs());
            navigate('/jobs');
        } catch (error: any) {
            console.error('Failed to create job:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data
            });
            alert(error.message || 'An error occurred while creating the job');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Job</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Job Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={jobData.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                        Company
                    </label>
                    <input
                        type="text"
                        name="company"
                        value={jobData.company}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={jobData.location}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={jobData.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirements">
                        Requirements
                    </label>
                    <textarea
                        name="requirements"
                        value={jobData.requirements}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minSalary">
                        Minimum Salary
                    </label>
                    <input
                        type="number"
                        name="minSalary"
                        value={jobData.minSalary}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxSalary">
                        Maximum Salary
                    </label>
                    <input
                        type="number"
                        name="maxSalary"
                        value={jobData.maxSalary}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                        Job Type
                    </label>
                    <select
                        name="type"
                        value={jobData.type}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                        Status
                    </label>
                    <select
                        name="status"
                        value={jobData.status}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create Job
                </button>
            </form>
        </div>
    );
};

export default CreateJob; 