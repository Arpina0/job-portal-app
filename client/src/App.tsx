import { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/jobs")  // Ensure this matches your backend endpoint
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  return (
    <div>
      <h1>Job Listings </h1>
      <ul>
        {jobs.length > 0 ? (
          jobs.map((job, index) => <li key={index}>{job}</li>)
        ) : (
          <p>Loading jobs...</p>
        )}
      </ul>
    </div>
  );
}

export default App;
