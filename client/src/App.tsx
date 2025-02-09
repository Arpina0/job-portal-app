import { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState<{ id: number; title: string; description: string; company?: string }[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/jobs")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  return (
    <div>
      <h1>Job Listings</h1>
      <ul>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <li key={job.id}>
              <h2>{job.title}</h2>
              <p>{job.description}</p>
              {job.company && <p><strong>Company:</strong> {job.company}</p>}
            </li>
          ))
        ) : (
          <p>Loading jobs...</p>
        )}
      </ul>
    </div>
  );
}

export default App;
