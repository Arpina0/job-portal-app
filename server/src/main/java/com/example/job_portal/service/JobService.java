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

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public ResponseEntity<?> createJob(String token, Job job) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty() || !user.get().getRole().name().equals("RECRUITER")) {
            return ResponseEntity.status(403).body("Only RECRUITER users can post job listings!");
        }

        job.setOwner(user.get());
        return ResponseEntity.ok(jobRepository.save(job));
    }

    public ResponseEntity<String> deleteJob(Long id, String token) {
        try {
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            Optional<User> recruiterOpt = userRepository.findByUsername(username);

            if (recruiterOpt.isEmpty() || !recruiterOpt.get().getRole().name().equals("RECRUITER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only recruiters can delete jobs.");
            }

            Optional<Job> jobOpt = jobRepository.findById(id);
            if (jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found.");
            }

            Job job = jobOpt.get();

            if (!job.getOwner().getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete jobs you posted.");
            }

            jobRepository.delete(job);
            return ResponseEntity.ok("Job deleted successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the job.");
        }
    }
}