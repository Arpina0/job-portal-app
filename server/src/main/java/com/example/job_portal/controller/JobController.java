package com.example.job_portal.controller;

import com.example.job_portal.model.Job;
import com.example.job_portal.model.User;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin
public class JobController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public JobController(JobRepository jobRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestHeader("Authorization") String token, @RequestBody Job job) {
        // Extract username from Bearer token
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> user = userRepository.findByUsername(username);
    
        // Debugging: Print user details
        System.out.println("Extracted username: " + username);
        System.out.println("User role from database: " + (user.isPresent() ? user.get().getRole() : "User not found"));
    
        //  Fix role comparison (convert enum to string)
        if (user.isEmpty() || !user.get().getRole().name().equals("RECRUITER")) {
            return ResponseEntity.status(403).body("Only RECRUITER users can post job listings!");
        }
    
        job.setOwner(user.get());
        // Save the job listing
        return ResponseEntity.ok(jobRepository.save(job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            // Extract username from JWT token
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            Optional<User> recruiterOpt = userRepository.findByUsername(username);
    
            // Log extracted information
            System.out.println("Extracted username: " + username);
            recruiterOpt.ifPresent(user -> System.out.println("User role from database: " + user.getRole()));
    
            // Validate that the user exists and has RECRUITER role
            if (recruiterOpt.isEmpty() || !recruiterOpt.get().getRole().name().equals("RECRUITER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only recruiters can delete jobs.");
            }
    
            // Fetch job from database
            Optional<Job> jobOpt = jobRepository.findById(id);
            if (jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found.");
            }
    
            Job job = jobOpt.get();
    
            // Log job owner
            System.out.println("Job owner username: " + job.getOwner().getUsername());
    
            // Ensure the recruiter can only delete their own jobs
            if (!job.getOwner().getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete jobs you posted.");
            }
    
            // Delete the job
            jobRepository.delete(job);
            return ResponseEntity.ok("Job deleted successfully.");
    
        } catch (Exception e) {
            System.err.println("Error during job deletion: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the job.");
        }
    }
    

    
    
    
}
