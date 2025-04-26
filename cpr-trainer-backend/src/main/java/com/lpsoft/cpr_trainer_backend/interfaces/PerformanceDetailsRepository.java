package com.lpsoft.cpr_trainer_backend.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpsoft.cpr_trainer_backend.PerformanceDetails;

import java.util.List;

public interface PerformanceDetailsRepository extends JpaRepository<PerformanceDetails, Integer> {
    List<PerformanceDetails> findByPerformanceId(int performanceId);
}
