package com.example.job_portal.service;

import com.example.job_portal.dto.JobSearchDTO;
import com.example.job_portal.model.Job;
import com.example.job_portal.model.User;
import com.example.job_portal.model.JobType;
import com.example.job_portal.model.JobStatus;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.repository.JobApplicationRepository;
import com.example.job_portal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public JobService(JobRepository jobRepository, UserRepository userRepository, JobApplicationRepository jobApplicationRepository, JwtUtil jwtUtil) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.jobApplicationRepository = jobApplicationRepository;
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

        System.out.println("Creating job for user: " + username);
        
        if (user.isEmpty()) {
            System.out.println("User not found in database: " + username);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("User not found: " + username);
        }

        System.out.println("User role from database: " + user.get().getRole().name());
        
        if (!user.get().getRole().name().equals("RECRUITER")) {
            System.out.println("User does not have RECRUITER role: " + user.get().getRole().name());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("User " + username + " does not have RECRUITER role. Current role: " + user.get().getRole().name());
        }

        // Set default values if null
        if (job.getJobType() == null) {
            job.setJobType(JobType.FULL_TIME);
        }
        if (job.getStatus() == null) {
            job.setStatus(JobStatus.OPEN);
        }

        job.setRecruiter(user.get());

        // Ensure salary fields are correctly assigned
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

        if (!job.getRecruiter().getUsername().equals(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own job listings.");
        }

        // Update all fields
        if (jobDetails.getTitle() != null) job.setTitle(jobDetails.getTitle());
        if (jobDetails.getCompany() != null) job.setCompany(jobDetails.getCompany());
        if (jobDetails.getDescription() != null) job.setDescription(jobDetails.getDescription());
        if (jobDetails.getRequirements() != null) job.setRequirements(jobDetails.getRequirements());
        if (jobDetails.getLocation() != null) job.setLocation(jobDetails.getLocation());
        if (jobDetails.getMinSalary() != null) job.setMinSalary(jobDetails.getMinSalary());
        if (jobDetails.getMaxSalary() != null) job.setMaxSalary(jobDetails.getMaxSalary());
        if (jobDetails.getJobType() != null) job.setJobType(jobDetails.getJobType());
        if (jobDetails.getStatus() != null) job.setStatus(jobDetails.getStatus());

        Job updatedJob = jobRepository.save(job);
        return ResponseEntity.ok(updatedJob);
    }

    /**
     * Deletes a job listing (Only the recruiter can delete).
     * @param id Job ID.
     * @param token Authorization token.
     * @return Success or error message.
     */
    @Transactional
    public ResponseEntity<String> deleteJob(Long id, String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Job> jobOpt = jobRepository.findById(id);

        if (userOpt.isEmpty() || jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job or user not found.");
        }

        Job job = jobOpt.get();
        User user = userOpt.get();

        if (!job.getRecruiter().getUsername().equals(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own job listings.");
        }

        try {
            // Delete all associated job applications first
            jobApplicationRepository.deleteByJob(job);
            // Then delete the job
            jobRepository.delete(job);
            return ResponseEntity.ok("Job deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete job: " + e.getMessage());
        }
    }

    /**
     * Search jobs with filters and pagination
     * @param searchDTO Search parameters
     * @return Page of jobs matching the search criteria
     */
    public Page<Job> searchJobs(JobSearchDTO searchDTO) {
        // Create Pageable object for pagination and sorting
        Sort sort = Sort.by(
            searchDTO.getSortDirection().equalsIgnoreCase("ASC") ? 
            Sort.Direction.ASC : Sort.Direction.DESC,
            searchDTO.getSortBy()
        );
        
        Pageable pageable = PageRequest.of(
            searchDTO.getPage(),
            searchDTO.getSize(),
            sort
        );

        // Convert salary values to BigDecimal if present
        BigDecimal minSalary = searchDTO.getMinSalary() != null ? 
            BigDecimal.valueOf(searchDTO.getMinSalary()) : null;
        BigDecimal maxSalary = searchDTO.getMaxSalary() != null ? 
            BigDecimal.valueOf(searchDTO.getMaxSalary()) : null;

        // Perform the search
        return jobRepository.searchJobs(
            searchDTO.getKeyword(),
            searchDTO.getLocation(),
            searchDTO.getJobType(),
            minSalary,
            maxSalary,
            pageable
        );
    }
}
