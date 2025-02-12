package com.example.job_portal.dto;

import com.example.job_portal.model.JobType;
import lombok.Data;

@Data
public class JobSearchDTO {
    private String keyword;
    private String location;
    private Double minSalary;
    private Double maxSalary;
    private JobType jobType;
    private String sortBy = "postedDate"; // default sort field
    private String sortDirection = "DESC"; // default sort direction
    private int page = 0;
    private int size = 10;
} 