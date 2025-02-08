package com.example.job_portal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @GetMapping
    public String getAllJobs() {
        return "Hello, this is your first API!";
    }
}
