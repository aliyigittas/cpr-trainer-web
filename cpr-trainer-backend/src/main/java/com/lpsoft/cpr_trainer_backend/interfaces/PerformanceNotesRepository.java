package com.lpsoft.cpr_trainer_backend.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpsoft.cpr_trainer_backend.PerformanceNotes;

public interface PerformanceNotesRepository extends JpaRepository<PerformanceNotes, Integer> {
    // Performansları UID'ye göre bul
    List<PerformanceNotes> findByPerformanceid(int performanceid);
    List<PerformanceNotes> findByPerformanceidAndNotetype(int performanceid, String type);
}
    