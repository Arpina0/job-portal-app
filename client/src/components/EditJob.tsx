import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchJobDetails } from '../store/slices/jobsSlice';
import api, { updateJob } from '../services/api';

const EditJob = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedJob, loading, error } = useSelector((state: RootState) => state.jobs);
    const currentUser = useSelector((state: RootState) => state.user.user);

    const [jobData, setJobData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        minSalary: '',
        maxSalary: '',
        type: 'FULL_TIME',
        status: 'OPEN',
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchJobDetails(parseInt(id)));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedJob) {
            setJobData({
                title: selectedJob.title,
                company: selectedJob.company,
                location: selectedJob.location,
                description: selectedJob.description,
                requirements: selectedJob.requirements,
                minSalary: selectedJob.minSalary?.toString() || '',
                maxSalary: selectedJob.maxSalary?.toString() || '',
                type: selectedJob.type,
                status: selectedJob.status,
            });
        }
    }, [selectedJob]);

    // Check if the current user is the job owner
    useEffect(() => {
        if (selectedJob && currentUser && selectedJob.recruiter_id !== currentUser.id) {
            navigate('/jobs');
        }
    }, [selectedJob, currentUser, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const updateData = {
            title: jobData.title,
            company: jobData.company,
            location: jobData.location,
            description: jobData.description,
            requirements: jobData.requirements,
            minSalary: parseFloat(jobData.minSalary),
            maxSalary: parseFloat(jobData.maxSalary),
            type: jobData.type,
            status: jobData.status,
            recruiter_id: currentUser?.id!
        };
        
        console.log('Form data before submission:', {
            original: jobData,
            processed: updateData
        });

        try {
            await updateJob(parseInt(id!), updateData);
            await dispatch(fetchJobDetails(parseInt(id!))).unwrap();
            navigate(`/jobs/${id}`);
        } catch (error: any) {
            console.error('Error updating job:', error);
            alert(error.message || 'Failed to update job');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Job</h1>
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

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Update Job
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/jobs/${id}`)}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditJob; 