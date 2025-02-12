package com.example.job_portal.repository;

import com.example.job_portal.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.job_portal.model.User;
import com.example.job_portal.model.Job;
import java.util.Optional;


@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicant(User applicant);
    List<JobApplication> findByJob(Job job);
    Optional<JobApplication> findByApplicantAndJob(User applicant, Job job);
    void deleteByJob(Job job);
}
