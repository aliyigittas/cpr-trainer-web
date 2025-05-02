package com.lpsoft.cpr_trainer_backend.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpsoft.cpr_trainer_backend.PositionDetails;

public interface PositionDetailsRepository extends JpaRepository<PositionDetails, Integer> {
    // Performansları UID'ye göre bul
    List<PositionDetails> findByPerformanceIdOrderByCompressionIdAsc(int performanceId);
    
}
