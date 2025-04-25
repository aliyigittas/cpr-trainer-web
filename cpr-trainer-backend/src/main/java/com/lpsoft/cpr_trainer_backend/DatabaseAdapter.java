package com.lpsoft.cpr_trainer_backend;

import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

public class DatabaseAdapter {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseAdapter(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public Boolean registerUser(User user) {
        try {
            String sql = "INSERT INTO `cpr`.`users` (firstname, surname, email, password, khasID) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, user.getFirstname(), user.getSurname(), user.getEmail(), user.getPassword(), user.getKhasID());
            return true;
        } catch (DataAccessException e) {
            System.err.println("❌ Kullanıcı eklenirken hata oluştu: " + e.getMessage());
            return false;
        }
    }

    public Boolean savePerformance(Performance performance) {
        try {
            String sql = "INSERT INTO `cpr`.`performances` (" +
                         "uid, feedbackType, meanDepth, meanFreq, stdDepth, stdFreq, " +
                         "highDepthCount, highFreqCount, lowDepthCount, lowFreqCount, " +
                         "totalCompression, score, trainingTime, performanceDate" +
                         ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
            jdbcTemplate.update(sql,
                performance.getUid(),
                performance.getFeedbackType(),
                performance.getMeanDepth(),
                performance.getMeanFreq(),
                performance.getStdDepth(),
                performance.getStdFreq(),
                performance.getHighDepthCount(),
                performance.getHighFreqCount(),
                performance.getLowDepthCount(),
                performance.getLowFreqCount(),
                performance.getTotalCompression(),
                performance.getScore(),
                performance.getTrainingTime(),
                performance.getPerformanceDate()
            );
            
            return true;
        } catch (Exception e) {
            System.err.println("❌ Performans eklenirken hata oluştu: " + e.getMessage());
            return false;
        }
    }

    public int getUid(String email) {
        try {
            String sql = "SELECT id FROM `cpr`.`users` WHERE email = '"+ email + "'";
            return jdbcTemplate.queryForObject(sql, Integer.class);
            
        } catch (Exception e) {
            System.err.println("❌ Kullanıcı ID'si alınırken hata oluştu: " + e.getMessage());
            return -1; // Hata durumunda -1 döndür
        }
    }
    
}