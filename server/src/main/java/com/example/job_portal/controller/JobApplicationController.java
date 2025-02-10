package com.example.job_portal.controller;

import com.example.job_portal.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @Autowired
    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<?> applyForJob(@RequestHeader("Authorization") String token, @PathVariable Long jobId) {
        return jobApplicationService.applyForJob(token, jobId);
    }

    @GetMapping
    public ResponseEntity<?> getUserApplications(@RequestHeader("Authorization") String token) {
    return jobApplicationService.getUserApplications(token);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(@RequestHeader("Authorization") String token, @PathVariable Long jobId) {
        return jobApplicationService.getJobApplications(token, jobId);
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
        @RequestHeader("Authorization") String token,
        @PathVariable Long applicationId,
        @RequestBody Map<String, String> request
    ) {
        String newStatus = request.get("status");
        return jobApplicationService.updateApplicationStatus(token, applicationId, newStatus);
    }


}
