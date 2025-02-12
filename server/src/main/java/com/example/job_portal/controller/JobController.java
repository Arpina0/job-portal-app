package com.example.job_portal.controller;

import com.example.job_portal.dto.JobSearchDTO;
import com.example.job_portal.model.Job;
import com.example.job_portal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    /**
     * Retrieves all job listings.
     * @return List of all jobs.
     */
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    /**
     * Retrieves a specific job by its ID.
     * @param id Job ID.
     * @return Job details or 404 if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    /**
     * Creates a new job listing (Only for users with RECRUITER role).
     * @param token Authorization token.
     * @param job Job details.
     * @return Created job or error message.
     */
    @PostMapping
    public ResponseEntity<?> createJob(@RequestHeader("Authorization") String token, @RequestBody Job job) {
        // Add these debug lines
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Current user: " + authentication.getName());
        System.out.println("Authorities: " + authentication.getAuthorities());
        System.out.println("Is authenticated: " + authentication.isAuthenticated());
        
        return jobService.createJob(token, job);
    }

    /**
     * Updates an existing job listing (Only the owner can update).
     * @param id Job ID.
     * @param token Authorization token.
     * @param jobDetails Updated job details.
     * @return Updated job or error message.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestHeader("Authorization") String token, @RequestBody Job jobDetails) {
        return jobService.updateJob(id, token, jobDetails);
    }

    /**
     * Deletes an existing job listing (Only the owner can delete).
     * @param id Job ID.
     * @param token Authorization token.
     * @return Success or error message.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        return jobService.deleteJob(id, token);
    }

    /**
     * Search jobs with filters and pagination
     * @param searchDTO Search parameters
     * @return Page of jobs matching the search criteria
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Job>> searchJobs(JobSearchDTO searchDTO) {
        return ResponseEntity.ok(jobService.searchJobs(searchDTO));
    }
}
