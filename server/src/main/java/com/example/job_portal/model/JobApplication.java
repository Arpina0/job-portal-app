package com.example.job_portal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "job_applications")
public class JobApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Column(nullable = false)
    private String status = "Pending"; // Default status

    public void setJob(Job job) {
        this.job = job;
    }

    public void setApplicant(User applicant) {
        this.applicant = applicant;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

