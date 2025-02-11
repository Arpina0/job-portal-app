package com.example.job_portal.service;

import com.example.job_portal.model.Job;
import com.example.job_portal.model.User;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public JobService(JobRepository jobRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Retrieves all available job listings.
     * @return List of all jobs.
     */
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    /**
     * Retrieves a job by its ID.
     * @param id Job ID.
     * @return Job details or 404 if not found.
     */
    public ResponseEntity<?> getJobById(Long id) {
        Optional<Job> jobOpt = jobRepository.findById(id);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found");
        }
        return ResponseEntity.ok(jobOpt.get());
    }

    /**
     * Creates a new job listing (Only for RECRUITER users).
     * @param token Authorization token.
     * @param job Job details.
     * @return Created job or error message.
     */
    public ResponseEntity<?> createJob(String token, Job job) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty() || !user.get().getRole().name().equals("RECRUITER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only RECRUITER users can post job listings!");
        }

        job.setRecruiter(user.get()); // ✅ Updated from `setOwner` to `setRecruiter`

        // Ensure salary fields are correctly assigned (BigDecimal for PostgreSQL NUMERIC)
        if (job.getMinSalary() == null) job.setMinSalary(BigDecimal.ZERO);
        if (job.getMaxSalary() == null) job.setMaxSalary(BigDecimal.ZERO);

        jobRepository.save(job);
        return ResponseEntity.ok("{\"message\": \"Job created successfully\", \"job\": " + job + "}");
    }

    /**
     * Updates a job listing (Only the recruiter can update).
     * @param id Job ID.
     * @param token Authorization token.
     * @param jobDetails Updated job details.
     * @return Updated job or error message.
     */
    public ResponseEntity<?> updateJob(Long id, String token, Job jobDetails) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Job> jobOpt = jobRepository.findById(id);

        if (userOpt.isEmpty() || jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job or user not found.");
        }

        Job job = jobOpt.get();
        User user = userOpt.get();

        if (!job.getRecruiter().getUsername().equals(user.getUsername())) { // ✅ Updated from `getOwner` to `getRecruiter`
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own job listings.");
        }

        // Ensure jobDetails contains valid data before updating
        if (jobDetails.getTitle() != null) job.setTitle(jobDetails.getTitle());
        if (jobDetails.getDescription() != null) job.setDescription(jobDetails.getDescription());
        if (jobDetails.getLocation() != null) job.setLocation(jobDetails.getLocation());
        if (jobDetails.getMinSalary() != null) job.setMinSalary(jobDetails.getMinSalary());
        if (jobDetails.getMaxSalary() != null) job.setMaxSalary(jobDetails.getMaxSalary());
        if (jobDetails.getJobType() != null) job.setJobType(jobDetails.getJobType());

        jobRepository.save(job);
        return ResponseEntity.ok("Job updated successfully.");
    }

    /**
     * Deletes a job listing (Only the recruiter can delete).
     * @param id Job ID.
     * @param token Authorization token.
     * @return Success or error message.
     */
    public ResponseEntity<String> deleteJob(Long id, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Job> jobOpt = jobRepository.findById(id);

        if (userOpt.isEmpty() || jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job or user not found.");
        }

        Job job = jobOpt.get();
        User user = userOpt.get();

        if (!job.getRecruiter().getUsername().equals(user.getUsername())) { // ✅ Updated from `getOwner` to `getRecruiter`
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own job listings.");
        }

        jobRepository.delete(job);
        return ResponseEntity.ok("Job deleted successfully.");
    }
}
