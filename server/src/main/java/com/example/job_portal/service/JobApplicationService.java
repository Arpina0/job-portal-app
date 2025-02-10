package com.example.job_portal.service;

import com.example.job_portal.model.Job;
import com.example.job_portal.model.JobApplication;
import com.example.job_portal.model.User;
import com.example.job_portal.repository.JobApplicationRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;


@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public JobApplicationService(JobApplicationRepository jobApplicationRepository, JobRepository jobRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Apply for a job (Job Seekers only).
     */
    public ResponseEntity<?> applyForJob(String token, Long jobId) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Job> jobOpt = jobRepository.findById(jobId);

        if (userOpt.isEmpty() || jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Job not found.");
        }

        User user = userOpt.get();
        Job job = jobOpt.get();

        // Prevent Recruiters from applying
        if (user.getRole().name().equals("RECRUITER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Recruiters cannot apply for jobs.");
        }

        JobApplication application = new JobApplication();
        application.setApplicant(user);
        application.setJob(job);
        application.setStatus("Pending");

        jobApplicationRepository.save(application);
        return ResponseEntity.ok("Job application submitted successfully.");
    }

    public ResponseEntity<?> getUserApplications(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByUsername(username);
    
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    
        User user = userOpt.get();
        List<JobApplication> applications = jobApplicationRepository.findByApplicant(user);
        
        return ResponseEntity.ok(applications);
    }
    
}
