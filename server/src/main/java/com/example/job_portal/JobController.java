package com.example.job_portal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin

public class JobController {
    @GetMapping
    public List<String> getAllJobs() {
        return List.of("Software Engineer","Doctor","Designer","ast");
    }
}
