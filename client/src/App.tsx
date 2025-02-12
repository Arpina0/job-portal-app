import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import JobListings from './components/JobListings';
import JobDetails from './components/JobDetails';
import CreateJob from './components/CreateJob';
import EditJob from './components/EditJob';
import ManageJobs from './components/ManageJobs';
import ApplicationManagement from './components/ApplicationManagement';
import MyApplications from './components/MyApplications';
import type { RootState } from './store';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="mt-10">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/jobs" 
              element={isAuthenticated ? <JobListings /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
            />
            <Route 
              path="/jobs/:id" 
              element={isAuthenticated ? <JobDetails /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/create-job" 
              element={
                isAuthenticated && user?.role === 'RECRUITER' 
                  ? <CreateJob /> 
                  : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/edit-job/:id" 
              element={
                isAuthenticated && user?.role === 'RECRUITER' 
                  ? <EditJob /> 
                  : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/manage-jobs" 
              element={
                isAuthenticated && user?.role === 'RECRUITER' 
                  ? <ManageJobs /> 
                  : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/applications/:jobId" 
              element={
                isAuthenticated && user?.role === 'RECRUITER' 
                  ? <ApplicationManagement /> 
                  : <Navigate to="/login" />
              } 
            />
            <Route
              path="/my-applications"
              element={
                isAuthenticated && user?.role === 'JOB_SEEKER'
                  ? <MyApplications />
                  : <Navigate to="/login" />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
