import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchAllJobs } from '../store/slices/jobsSlice';
import type { AppDispatch } from '../store'; // Import AppDispatch type

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJobData({ ...jobData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // Decode JWT token to see the username
            const base64Url = token!.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            console.log('Decoded token:', JSON.parse(jsonPayload));

            // Add this to check user role
            try {
                const userResponse = await axios.get('/api/users/me', {
                    headers: {
                        Authorization: token?.startsWith('Bearer ') ? token : `Bearer ${token}`,
                    }
                });
                console.log('Current user details:', userResponse.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }

            console.log('Token being sent:', token);

            // Log the data being sent
            console.log('Sending job data:', {
                ...jobData,
                minSalary: parseFloat(jobData.minSalary),
                maxSalary: parseFloat(jobData.maxSalary),
                type: jobData.type || 'FULL_TIME', // Ensure type is never null
                status: jobData.status || 'OPEN'   // Ensure status is never null
            });

            const response = await axios.post('/api/jobs', {
                ...jobData,
                minSalary: parseFloat(jobData.minSalary),
                maxSalary: parseFloat(jobData.maxSalary),
                type: jobData.type,          // Already a string
                status: jobData.status       // Already a string
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token?.startsWith('Bearer ') ? token : `Bearer ${token}`,
                },
            });
            console.log('Response:', response.data);
            dispatch(fetchAllJobs());
            navigate('/jobs');
        } catch (error: any) {
            console.log('Job Data:', jobData);
            console.error('Error details:', {
                status: error.response?.status,
                message: error.response?.data,
                headers: error.response?.headers,
                fullError: error.response
            });
            
            alert(error.response?.data || 'An error occurred while creating the job');
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