package com.example.job_portal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@JsonIgnoreProperties({"recruiter", "applications"}) // Prevents recursive JSON issues
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 255)
    private String company;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "min_salary", precision = 12, scale = 2)
    private BigDecimal minSalary; // Matches PostgreSQL's numeric(12,2)

    @Column(name = "max_salary", precision = 12, scale = 2)
    private BigDecimal maxSalary; // Matches PostgreSQL's numeric(12,2)

    @Column(name = "type", nullable = false, length = 20)
    private String jobType; // Maps to PostgreSQL's "type" column

    @Column(name = "status", nullable = false, length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'OPEN'")
    private String status = "OPEN"; // Default value is 'OPEN'

    @Column(name = "posted_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime postedDate = LocalDateTime.now(); // Automatically set to current timestamp

    @ManyToOne
    @JoinColumn(name = "recruiter_id", nullable = false) // Foreign key mapping
    private User recruiter;

    // Default Constructor
    public Job() {}

    // Parameterized Constructor
    public Job(String title, String description, String company, String location, String requirements,
               BigDecimal minSalary, BigDecimal maxSalary, String jobType, String status, User recruiter) {
        this.title = title;
        this.description = description;
        this.company = company;
        this.location = location;
        this.requirements = requirements;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
        this.jobType = jobType;
        this.status = status;
        this.recruiter = recruiter;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public BigDecimal getMinSalary() { return minSalary; }
    public void setMinSalary(BigDecimal minSalary) { this.minSalary = minSalary; }

    public BigDecimal getMaxSalary() { return maxSalary; }
    public void setMaxSalary(BigDecimal maxSalary) { this.maxSalary = maxSalary; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }

    public User getRecruiter() { return recruiter; }
    public void setRecruiter(User recruiter) { this.recruiter = recruiter; }
}
