package com.lpsoft.cpr_trainer_backend;

import java.util.List;

import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DatabaseAdapter {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseAdapter(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public Boolean registerUser(User user) {
        try {
            String sql = "INSERT INTO `cpr`.`users` (firstname, surname, email, password, khasID, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, user.getFirstname(), user.getSurname(), user.getEmail(), user.getPassword(), user.getKhasID(), user.getRole(), user.getCreatedAt());
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

    public Boolean savePerformanceNotes(String note, int uid, String noteType) {
        int lastPerformanceId = getLastPerformanceByUid(uid);

        try {
            String sql = "INSERT INTO `cpr`.`performancenotes` (" +
                         "performanceid, notetype, note" +
                         ") VALUES (?, ?, ?)";
    
            jdbcTemplate.update(sql,
                lastPerformanceId,
                noteType,
                note
            );
            
            return true;
        } catch (Exception e) {
            System.err.println("❌ Performans notu eklenirken hata oluştu: " + e.getMessage());
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

    public Boolean saveDepthArray(List<Double> DepthArray, int uid, String type){
        int lastPerformanceId = getLastPerformanceByUid(uid);
        try {
            for(int i=0; i<DepthArray.size(); i++){
                
                    String sql = "INSERT INTO `cpr`.`performancedetails` (" +
                                "performanceId, compressionId, detailType, val" +
                                ") VALUES (?, ?, ?, ?)";
            
                    jdbcTemplate.update(sql, lastPerformanceId, i+1, type, DepthArray.get(i));                
            }
            return true;
        } catch (Exception e) {
            System.err.println("❌ Performans eklenirken hata oluştu: " + e.getMessage());
            return false;
        }
    }

    public Boolean saveFreqArray(List<Double> FreqArray, int uid, String type){
        int lastPerformanceId = getLastPerformanceByUid(uid);
        try {
            for(int i=0; i<FreqArray.size(); i++){
                
                    String sql = "INSERT INTO `cpr`.`performancedetails` (" +
                                "performanceId, compressionId, detailType, val" +
                                ") VALUES (?, ?, ?, ?)";
            
                    jdbcTemplate.update(sql, lastPerformanceId, i+1, type, FreqArray.get(i));                
            }
            return true;
        } catch (Exception e) {
            System.err.println("❌ Performans eklenirken hata oluştu: " + e.getMessage());
            return false;
        }
    }

    public int getLastPerformanceByUid(int uid) {
        try {
            String sql = "SELECT MAX(id) FROM `cpr`.`performances` WHERE uid = ?";
            return jdbcTemplate.queryForObject(sql, Integer.class, uid);
        } catch (Exception e) {
            System.err.println("❌ Kullanıcı ID'si alınırken hata oluştu: " + e.getMessage());
            return -1; // Hata durumunda -1 döndür
        }
    }

    public Boolean saveInstructorNote(int performanceid, String noteType, String note) {
        try {
            // Önce bu performanceid ve notetype için kayıt var mı kontrol edelim
            String checkSql = "SELECT COUNT(*) FROM `cpr`.`performancenotes` " +
                             "WHERE performanceid = ? AND notetype = ?";
            int count = jdbcTemplate.queryForObject(checkSql, Integer.class, performanceid, noteType);
    
            if (count > 0) {
                // Kayıt varsa UPDATE yap
                String updateSql = "UPDATE `cpr`.`performancenotes` SET note = ? " +
                                 "WHERE performanceid = ? AND notetype = ?";
                jdbcTemplate.update(updateSql, note, performanceid, noteType);
            } else {
                // Kayıt yoksa INSERT yap
                String insertSql = "INSERT INTO `cpr`.`performancenotes` " +
                                  "(performanceid, notetype, note) VALUES (?, ?, ?)";
                jdbcTemplate.update(insertSql, performanceid, noteType, note);
            }
            return true;
        } catch (Exception e) {
            System.err.println("❌ Performans notu eklenirken/güncellenirken hata oluştu: " + e.getMessage());
            return false;
        }
    }

    public Boolean updateInstructorNote(int performanceid, String noteType, String note) {
        try {
            String updateSql = "UPDATE `cpr`.`performancenotes` SET note = ? " +
                               "WHERE performanceid = ? AND notetype = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, note, performanceid, noteType);
    
            if (rowsAffected == 0) {
                System.err.println("⚠️ Güncellenecek not bulunamadı.");
                return false;
            }
    
            return true;
        } catch (Exception e) {
            System.err.println("❌ Not güncellenirken hata oluştu: " + e.getMessage());
            return false;
        }
    }
    
    public Boolean savePositionArray(List<Double> positionArray, int uid){
        int lastPerformanceId = getLastPerformanceByUid(uid);
        try {
            for(int i=0; i<positionArray.size(); i++){
                
                    String sql = "INSERT INTO `cpr`.`positiondetails` (" +
                                "performanceId, compressionId, val" +
                                ") VALUES (?, ?, ?)";
            
                    jdbcTemplate.update(sql, lastPerformanceId, i+1, positionArray.get(i));                
            }
            return true;
        } catch (Exception e) {
            System.err.println("❌ Performans eklenirken hata oluştu: " + e.getMessage());
            return false;
        }
    }
    
    public Boolean deactivateUser(int uid){
        System.out.println("Deactivating user with UID: " + uid);
        String sql = "UPDATE users SET status = 0 WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, uid);
        System.out.println("rows:"+ rowsAffected);
        return rowsAffected > 0;
    }

    public Boolean deactivatePerformances(int uid){
        String sql = "UPDATE performances SET status = 0 WHERE uid = ?";
        int rowsAffected = jdbcTemplate.update(sql, uid);
        System.out.println("rows:"+ rowsAffected);
        return rowsAffected > 0;
    }

}