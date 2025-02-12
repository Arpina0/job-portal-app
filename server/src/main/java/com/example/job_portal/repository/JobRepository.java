package com.example.job_portal.repository;

import com.example.job_portal.model.Job;
import com.example.job_portal.model.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    @Query(value = """
            SELECT j FROM Job j 
            WHERE (:keyword IS NULL OR 
                   LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
                   LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
                   LOWER(j.requirements) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
            AND (:jobType IS NULL OR j.jobType = :jobType)
            AND (:minSalary IS NULL OR j.minSalary >= :minSalary)
            AND (:maxSalary IS NULL OR j.maxSalary <= :maxSalary)
            """)
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("jobType") JobType jobType,
            @Param("minSalary") BigDecimal minSalary,
            @Param("maxSalary") BigDecimal maxSalary,
            Pageable pageable
    );
}
