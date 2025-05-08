package com.lpsoft.cpr_trainer_backend;

import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
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
                         "totalCompression, score, trainingTime, performanceDate, " +
                         "status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
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
                performance.getPerformanceDate(),
                1
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
            
            String insertSql = "INSERT INTO `cpr`.`performancenotes` " +
            "(performanceid, notetype, note) VALUES (?, ?, ?)";
            jdbcTemplate.update(insertSql, performanceid, noteType, note);
            
            return true;
        } catch (DataAccessException e) {
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

    public List<PerformanceDetails> findByPerformanceId(int performanceId) {
        String sql = "SELECT * FROM performancedetails WHERE performanceId = ?";
        
        try {
            return jdbcTemplate.query(sql, new Object[]{performanceId}, (rs, rowNum) -> {
                int id = rs.getInt("id");
                String detailType = rs.getString("detailType");
                Double val = rs.getDouble("val");
                return new PerformanceDetails(id, performanceId, detailType, val);
            });
        } catch (DataAccessException e) {
            System.err.println("❌ Performans detayları alınırken hata oluştu: " + e.getMessage());
            return List.of(); // Return empty list on error
        }
    }
    
    public List<PositionDetails> findByPerformanceIdOrderByCompressionIdAsc(int performanceId) {
        String sql = "SELECT * FROM positiondetails WHERE performanceId = ? ORDER BY compressionId ASC";
    
        try {
            return jdbcTemplate.query(sql, new Object[]{performanceId}, (rs, rowNum) -> {
                int id = rs.getInt("id");
                int compressionId = rs.getInt("compressionId");
                Double val = rs.getDouble("val");
                return new PositionDetails(id, performanceId, compressionId, val);
            });
        } catch (DataAccessException e) {
            System.err.println("❌ Pozisyon detayları alınırken hata oluştu: " + e.getMessage());
            return List.of(); // Return empty list if an error occurs
        }
    }
    
    public Optional<User> findByUsernameAndStatus(String username, int status) {
        String sql = "SELECT * FROM users WHERE username = ? AND status = ?";
    
        try {
            User user = jdbcTemplate.queryForObject(sql, new Object[]{username, status}, (rs, rowNum) -> 
                new User(
                    rs.getInt("id"),
                    rs.getString("firstname"),
                    rs.getString("surname"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("password"),  // Ensure this matches the actual column name in your database
                    rs.getString("khasID"),
                    rs.getString("role"),
                    rs.getTimestamp("createdAt").toLocalDateTime().toString(),
                    rs.getInt("status")
                )
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<User> findByEmailAndStatus(String email, int status) {
        String sql = "SELECT * FROM users WHERE email = ? AND status = ?";
    
        try {
            User user = jdbcTemplate.queryForObject(sql, new Object[]{email, status}, (rs, rowNum) ->
            new User(
                rs.getInt("id"),
                rs.getString("firstname"),
                rs.getString("surname"),
                rs.getString("username"),
                rs.getString("email"),
                rs.getString("password"),  // Ensure this matches the actual column name in your database
                rs.getString("khasID"),
                rs.getString("role"),
                rs.getTimestamp("createdAt").toLocalDateTime().toString(),
                rs.getInt("status")
            )
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<User> findByKhasIDAndStatus(String khasID, int status) {
        String sql = "SELECT * FROM users WHERE khasID = ? AND status = ?";
    
        try {
            User user = jdbcTemplate.queryForObject(sql, new Object[]{khasID, status}, (rs, rowNum) -> 
                new User(
                    rs.getInt("id"),
                    rs.getString("firstname"),
                    rs.getString("surname"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("password"),  // Ensure this matches the actual column name in your database
                    rs.getString("khasID"),
                    rs.getString("role"),
                    rs.getTimestamp("createdAt").toLocalDateTime().toString(),
                    rs.getInt("status")
                )
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<User> findById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
    
        try {
            User user = jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) ->
            new User(
                rs.getInt("id"),
                rs.getString("firstname"),
                rs.getString("surname"),
                rs.getString("username"),
                rs.getString("email"),
                rs.getString("password"),  // Ensure this matches the actual column name in your database
                rs.getString("khasID"),
                rs.getString("role"),
                rs.getTimestamp("createdAt").toLocalDateTime().toString(),
                rs.getInt("status")
            )
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
    
    public User getUsernameByKhasID(String khasID) {
        String sql = "SELECT * FROM users WHERE khasID = ?";
    
        try {
            User user = jdbcTemplate.queryForObject(sql, new Object[]{khasID}, (rs, rowNum) ->
                new User(
                    rs.getInt("id"),
                    rs.getString("firstname"),
                    rs.getString("surname"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("password"),
                    rs.getString("khasID"),
                    rs.getString("role"),
                    rs.getTimestamp("createdAt").toLocalDateTime().toString(),
                    rs.getInt("status")
                )
            );
            return user;
        } catch (EmptyResultDataAccessException e) {
            return new User();
        }
    }
    
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
    
        try {
            User user = jdbcTemplate.queryForObject(sql, new Object[]{username}, (rs, rowNum) ->
            new User(
                rs.getInt("id"),
                rs.getString("firstname"),
                rs.getString("surname"),
                rs.getString("username"),
                rs.getString("email"),
                rs.getString("password"),  // Ensure this matches the actual column name in your database
                rs.getString("khasID"),
                rs.getString("role"),
                rs.getTimestamp("createdAt").toLocalDateTime().toString(),
                rs.getInt("status")
            )
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
    
    public List<Performance> findByUidAndStatus(int uid, int status) {
        String sql = "SELECT * FROM performances WHERE uid = ? AND status = ?";
    
        try {
            return jdbcTemplate.query(sql, new Object[]{uid, status}, (rs, rowNum) -> {
                Performance p = new Performance();
                p.setId(rs.getInt("id"));
                p.setUid(rs.getInt("uid"));
                p.setFeedbackType(rs.getString("feedbackType"));
                p.setMeanDepth(rs.getDouble("meanDepth"));
                p.setMeanFreq(rs.getDouble("meanFreq"));
                p.setStdDepth(rs.getDouble("stdDepth"));
                p.setStdFreq(rs.getDouble("stdFreq"));
                p.setHighDepthCount(rs.getInt("highDepthCount"));
                p.setHighFreqCount(rs.getInt("highFreqCount"));
                p.setLowDepthCount(rs.getInt("lowDepthCount"));
                p.setLowFreqCount(rs.getInt("lowFreqCount"));
                p.setTotalCompression(rs.getInt("totalCompression"));
                p.setTrainingTime(rs.getDouble("trainingTime"));
                p.setPerformanceDate(rs.getString("performanceDate"));
                p.setScore(rs.getDouble("score"));
                p.setStatus(rs.getInt("status"));
                return p;
            });
        } catch (DataAccessException e) {
            System.err.println("❌ UID ve statüye göre performanslar alınamadı: " + e.getMessage());
            return List.of();
        }
    }

    public List<Performance> findAllByStatus(int status) {
        String sql = "SELECT * FROM performances WHERE status = ?";
    
        try {
            return jdbcTemplate.query(sql, new Object[]{status}, (rs, rowNum) -> {
                Performance p = new Performance();
                p.setId(rs.getInt("id"));
                p.setUid(rs.getInt("uid"));
                p.setFeedbackType(rs.getString("feedbackType"));
                p.setMeanDepth(rs.getDouble("meanDepth"));
                p.setMeanFreq(rs.getDouble("meanFreq"));
                p.setStdDepth(rs.getDouble("stdDepth"));
                p.setStdFreq(rs.getDouble("stdFreq"));
                p.setHighDepthCount(rs.getInt("highDepthCount"));
                p.setHighFreqCount(rs.getInt("highFreqCount"));
                p.setLowDepthCount(rs.getInt("lowDepthCount"));
                p.setLowFreqCount(rs.getInt("lowFreqCount"));
                p.setTotalCompression(rs.getInt("totalCompression"));
                p.setTrainingTime(rs.getDouble("trainingTime"));
                p.setPerformanceDate(rs.getString("performanceDate"));
                p.setScore(rs.getDouble("score"));
                p.setStatus(rs.getInt("status"));
                return p;
            });
        } catch (DataAccessException e) {
            System.err.println("❌ Statüye göre tüm performanslar alınamadı: " + e.getMessage());
            return List.of();
        }
    }

    public List<PerformanceNotes> findByPerformanceid(int performanceid) {
        String sql = "SELECT * FROM performancenotes WHERE performanceid = ?";
    
        try {
            return jdbcTemplate.query(sql, new Object[]{performanceid}, (rs, rowNum) -> {
                PerformanceNotes note = new PerformanceNotes();
                note.setid(rs.getInt("id"));
                note.setPerformanceid(rs.getInt("performanceid"));
                note.setNotetype(rs.getString("notetype"));
                note.setnote(rs.getString("note"));
                return note;
            });
        } catch (DataAccessException e) {
            System.err.println("❌ performancenotes alınırken hata oluştu (performanceid): " + e.getMessage());
            return List.of();
        }
    }

    public List<PerformanceNotes> findByPerformanceidAndNotetype(int performanceid, String type) {
        String sql = "SELECT * FROM performancenotes WHERE performanceid = ? AND notetype = ?";
    
        try {
            return jdbcTemplate.query(sql, new Object[]{performanceid, type}, (rs, rowNum) -> {
                PerformanceNotes note = new PerformanceNotes();
                note.setid(rs.getInt("id"));
                note.setPerformanceid(rs.getInt("performanceid"));
                note.setNotetype(rs.getString("notetype"));
                note.setnote(rs.getString("note"));
                return note;
            });
        } catch (DataAccessException e) {
            System.err.println("❌ performancenotes alınırken hata oluştu (performanceid + notetype): " + e.getMessage());
            return List.of();
        }
    }

    public List<User> findAllUsers() {
        String sql = "SELECT * FROM users WHERE status = 1"; // or remove WHERE clause to get all
    
        try {
            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setFirstname(rs.getString("firstname"));
                user.setSurname(rs.getString("surname"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
                user.setKhasID(rs.getString("khasID"));
                user.setRole(rs.getString("role"));
                user.setStatus(rs.getInt("status"));
                user.setCreatedAt(rs.getTimestamp("createdAt").toLocalDateTime().toString());
                return user;
            });
        } catch (DataAccessException e) {
            System.err.println("❌ Kullanıcılar alınırken hata oluştu: " + e.getMessage());
            return List.of();
        }
    }

    public Boolean saveUser(User user) {
        try {
            String sql = "INSERT INTO users (firstname, surname, username, email, password, khasID, role, status, createdAt) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                user.getFirstname(),
                user.getSurname(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getKhasID(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
            );
            return true;
        } catch (DataAccessException e) {
            System.err.println("❌ Kullanıcı kaydedilirken hata oluştu: " + e.getMessage());
            return false;
        }
    }

    public Boolean UpdateUser(User user){
        try {
            String sql = "UPDATE users SET firstname = ?, surname = ?, username = ?, email = ?, password = ?, khasID = ?, role = ?, status = ? "+
            "WHERE id = ?";

            jdbcTemplate.update(sql,
                user.getFirstname(),
                user.getSurname(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getKhasID(),
                user.getRole(),
                user.getStatus(),
                user.getId()
            );
            return true;
        } catch (DataAccessException e) {
            System.err.println("❌ Kullanıcı kaydedilirken hata oluştu: " + e.getMessage());
            return false;
        }
    }
    
}