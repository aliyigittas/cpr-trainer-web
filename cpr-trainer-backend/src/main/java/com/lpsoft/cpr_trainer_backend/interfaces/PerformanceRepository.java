package com.lpsoft.cpr_trainer_backend.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpsoft.cpr_trainer_backend.Performance;

public interface PerformanceRepository extends JpaRepository<Performance, Integer> {
    // Performansları UID'ye göre bul
    List<Performance> findByUidAndStatus(int uid, int status);
    List<Performance> findAllByStatus(int status);
    
}
