package com.example.job_portal.controller;

import com.example.job_portal.model.Job;
import com.example.job_portal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin // CORS hatalarını önlemek için
public class JobController {

    private final JobRepository jobRepository;

    @Autowired
    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // Tüm işleri getir
    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Yeni bir iş ekle
    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }
}
