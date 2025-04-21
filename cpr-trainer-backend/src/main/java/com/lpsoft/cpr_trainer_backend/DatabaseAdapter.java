package com.lpsoft.cpr_trainer_backend;

import javax.sql.DataSource;

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
        } catch (Exception e) {
            System.err.println("❌ Kullanıcı eklenirken hata oluştu: " + e.getMessage());
            return false;
        }
    }
}