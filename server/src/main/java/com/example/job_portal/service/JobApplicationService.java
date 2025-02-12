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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;




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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User or Job not found.");
        }

        User user = userOpt.get();
        Job job = jobOpt.get();

        // Check if user is a JOB_SEEKER
        if (!user.getRole().name().equals("JOB_SEEKER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Only job seekers can apply for jobs.");
        }

        // Check if user has already applied
        boolean hasApplied = jobApplicationRepository.findByApplicantAndJob(user, job).isPresent();
        if (hasApplied) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("You have already applied for this job.");
        }

        JobApplication application = new JobApplication();
        application.setApplicant(user);
        application.setJob(job);
        application.setStatus("PENDING");

        jobApplicationRepository.save(application);
        return ResponseEntity.ok("Application submitted successfully.");
    }

    public ResponseEntity<?> getUserApplications(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByUsername(username);
    
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    
        User user = userOpt.get();
        List<JobApplication> applications = jobApplicationRepository.findByApplicant(user);
        
        // Transform to match frontend expectations
        List<Map<String, Object>> response = applications.stream().map(application -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", application.getId());
            data.put("job_id", application.getJob().getId());
            data.put("applicant_id", application.getApplicant().getId());
            data.put("status", application.getStatus());
            return data;
        }).collect(Collectors.toList());

        System.out.println("User applications for " + username + ": " + response); // Debug log
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getJobApplications(String token, Long jobId) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> recruiterOpt = userRepository.findByUsername(username);

        if (recruiterOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User recruiter = recruiterOpt.get();
        
        // ✅ Fetch the job
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found.");
        }

        Job job = jobOpt.get();

        // ✅ Ensure only the job owner (recruiter) can access applications
        if (!job.getRecruiter().getUsername().equals(recruiter.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only view applications for jobs you posted.");
        }

        // ✅ Fetch applications for the job
        List<JobApplication> applications = jobApplicationRepository.findByJob(job);

        // ✅ Transform response to return structured data
        List<Map<String, Object>> response = applications.stream().map(application -> {
            Map<String, Object> data = new HashMap<>();
            data.put("applicationId", application.getId());
            data.put("applicantUsername", application.getApplicant().getUsername());
            data.put("status", application.getStatus());
            return data;
        }).toList();

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> updateApplicationStatus(String token, Long applicationId, String newStatus) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> recruiterOpt = userRepository.findByUsername(username);
    
        if (recruiterOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    
        User recruiter = recruiterOpt.get();
        
        // ✅ Fetch the application
        Optional<JobApplication> applicationOpt = jobApplicationRepository.findById(applicationId);
        if (applicationOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found.");
        }
    
        JobApplication application = applicationOpt.get();
        Job job = application.getJob();
    
        // ✅ Ensure only the job owner (recruiter) can update the status
        if (!job.getRecruiter().getUsername().equals(recruiter.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update applications for jobs you posted.");
        }
    
        // ✅ Ensure the new status is valid
        List<String> validStatuses = List.of("Accepted", "Rejected", "Pending");
        if (!validStatuses.contains(newStatus)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status. Allowed values: Accepted, Rejected, Pending.");
        }
    
        // ✅ Update status
        application.setStatus(newStatus);
        jobApplicationRepository.save(application);
    
        return ResponseEntity.ok("Application status updated successfully.");
    }
    

    
}
